import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const require = createRequire(path.join(root, "package.json"));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { chromium } = process.env.MOBILE_PLAYWRIGHT_MODULE ? require(process.env.MOBILE_PLAYWRIGHT_MODULE) : require("playwright");
const output = process.env.MOBILE_QA_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(), "assetflow-mobile-"));
fs.mkdirSync(output, { recursive: true });
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const pages = walk(path.join(root, "app")).filter((f) => f.endsWith("/page.tsx")).sort();
const sources = walk(path.join(root, "app")).concat(walk(path.join(root, "components"))).filter((f) => f.endsWith(".tsx"));
const actionNames = new Set();
for (const f of sources) for (const match of fs.readFileSync(f, "utf8").matchAll(/import\s*\{([^}]+)\}\s*from\s*["'][^"']*actions["']/g)) for (const name of match[1].split(",")) actionNames.add(name.trim().split(/\s+as\s+/)[0]);
const cssModules = new Map();
const mockNext = `import React from 'react'; export default function Link({href,children,prefetch,...rest}){return React.createElement('a',{...rest,href},children)}; export const usePathname=()=>'/assets'; export const useRouter=()=>({refresh(){},push(){}}); export const redirect=(url)=>{throw new Error('REDIRECT:'+url)}; export const notFound=()=>{throw new Error('NOT_FOUND')};`;
const mocks = {
  name: "isolated-layout-fixtures",
  setup(b) {
    b.onResolve({ filter: /^next\/(link|navigation)$/ }, (args) => ({ path: args.path, namespace: "next-fixture" }));
    b.onLoad({ filter: /.*/, namespace: "next-fixture" }, () => ({ contents: mockNext, loader: "js", resolveDir: root }));
    b.onResolve({ filter: /(?:^|\/)actions$/ }, () => ({ path: "actions", namespace: "actions-fixture" }));
    b.onLoad({ filter: /.*/, namespace: "actions-fixture" }, () => ({ contents: [...actionNames].map((name) => `export function ${name}(){throw new Error('Layout test must not execute server actions')}`).join("\n"), loader: "js" }));
    b.onResolve({ filter: /^@\/lib\/supabase\/(server|browser)$/ }, () => ({ path: path.join(here, "mobile-fixtures.mjs") }));
    b.onLoad({ filter: /\.module\.css$/ }, (args) => {
      const css = fs.readFileSync(args.path, "utf8");
      const names = [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
      cssModules.set(args.path, css);
      return { contents: `export default ${JSON.stringify(Object.fromEntries(names.map((n) => [n, n])))}`, loader: "js" };
    });
  },
};
const entry = pages.map((f, i) => `import Page${i} from ${JSON.stringify(f)};`).join("\n") + `
import {AppNav} from './components/AppNav';
export {AppNav};
export {assets,setEmpty} from './scripts/mobile-fixtures.mjs';
export {OPERATIONAL_DOCUMENTS} from './lib/operational-documents';
export const pages=[${pages.map((f, i) => `{file:${JSON.stringify(path.relative(root, f))},component:Page${i}}`).join(",")}];`;
const bundle = path.join(output, "fixtures.cjs");
await build({ stdin: { contents: entry, resolveDir: root, sourcefile: "fixture-entry.tsx", loader: "tsx" }, outfile: bundle, bundle: true, platform: "node", format: "cjs", jsx: "automatic", external: ["react", "react-dom", "react/jsx-runtime"], plugins: [mocks], tsconfig: path.join(root, "tsconfig.json") });
// Temp bundles resolve app dependencies explicitly rather than relying on a temp-directory node_modules.
const Module = require("node:module");
const fixtureModule = new Module(bundle);
fixtureModule.paths = Module._nodeModulePaths(root);
fixtureModule._compile(fs.readFileSync(bundle, "utf8"), bundle);
const fixtures = fixtureModule.exports;
const css = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
const failures = [];
const rendered = [];
for (const empty of [false, true]) {
  fixtures.setEmpty(empty);
  for (const page of fixtures.pages) {
    const detail = /\[/.test(page.file);
    if (empty && detail) continue; // Detail pages require a record; list/form empty states are exercised.
    try {
      const component = await page.component({ params: Promise.resolve({ id: "fixture-1", token: "fixture-token", slug: fixtures.OPERATIONAL_DOCUMENTS[0].slug }), searchParams: Promise.resolve({ q: "DEW", error: empty ? "Synthetic error notice for layout verification" : undefined }) });
      const privateRoute = page.file.includes("(private)");
      const html = renderToStaticMarkup(React.createElement(React.Fragment, null, privateRoute && React.createElement(fixtures.AppNav, { fullName: "Synthetic Operator", role: "admin" }), privateRoute ? React.createElement("main", { className: "container" }, component) : component));
      rendered.push({ file: page.file, empty, html });
    } catch (error) {
      if (page.file === "app/page.tsx" && error.message.startsWith("REDIRECT:")) rendered.push({ file: page.file, empty, redirect: error.message });
      else failures.push(`${page.file} render: ${error.stack}`);
    }
  }
}
// Render every seeded document, not just the parameterised route's first document.
const documentPage = fixtures.pages.find((p) => p.file === "app/(private)/documents/[slug]/page.tsx");
fixtures.setEmpty(false);
for (const doc of fixtures.OPERATIONAL_DOCUMENTS) {
  const component = await documentPage.component({ params: Promise.resolve({ slug: doc.slug }), searchParams: Promise.resolve({}) });
  rendered.push({ file: `document:${doc.slug}`, empty: false, html: renderToStaticMarkup(React.createElement("main", { className: "container" }, component)) });
}
let executablePath = process.env.MOBILE_CHROMIUM_PATH;
let args = [];
if (process.env.MOBILE_CHROMIUM_MODULE) {
  const packaged = require(process.env.MOBILE_CHROMIUM_MODULE);
  executablePath ||= await packaged.executablePath();
  args = packaged.args;
}
const browser = await chromium.launch({ headless: true, executablePath, args });
const results = [];
try {
  const page = await browser.newPage();
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    for (const record of rendered) {
      if (record.redirect) { results.push({ ...record, width }); continue; }
      const styles = record.file.includes("repair-cafe") ? [...cssModules.values()].join("\n") : "";
      await page.setContent(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><style>${styles}</style></head><body>${record.html}</body></html>`);
      const errors = await page.evaluate(() => {
        const errors = [];
        // Do not let root clipping disguise overflowing controls or cards.
        document.documentElement.style.overflowX = "visible";
        document.body.style.overflowX = "visible";
        if (document.documentElement.scrollWidth > innerWidth + 1) errors.push(`document overflow ${document.documentElement.scrollWidth}/${innerWidth}`);
        for (const el of document.querySelectorAll(".card,input:not([type=hidden]),select,textarea,button,.nav-menu")) {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height || el.closest(".asset-batch-print-area, .trap")) continue;
          const scroller = el.closest(".table-wrap");
          if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) continue;
          if (r.right > innerWidth + 1 || r.left < -1) errors.push(`outside viewport: ${el.tagName}.${el.className}`);
          if (["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) && !["checkbox", "radio"].includes(el.type) && parseFloat(getComputedStyle(el).fontSize) < 16) errors.push(`small input text: ${el.name}`);
        }
        if (innerWidth <= 720) for (const el of document.querySelectorAll(".record-field-value")) {
          if (el.getBoundingClientRect().width < 130) errors.push(`squeezed table value: ${el.textContent.slice(0,45)}`);
        }
        return [...new Set(errors)];
      });
      results.push({ file: record.file, empty: record.empty, width, errors });
      for (const error of errors) failures.push(`${record.file} (${width}px, ${record.empty ? "empty" : "populated"}): ${error}`);
      if (["app/(private)/assets/page.tsx", "app/(private)/media/page.tsx", "app/(private)/processing/page.tsx", "app/(private)/admin/permissions/page.tsx"].includes(record.file) && width === 390 && !record.empty) {
        await page.screenshot({ path: path.join(output, record.file.split("/").at(-2) + "-390.png"), fullPage: true });
      }
    }
  }
  // Mount actual client components to verify controls beyond static layout.
  const clientEntry = `import React from 'react'; import {createRoot} from 'react-dom/client';
import {AppNav} from './components/AppNav'; import {AssetBatchTable} from './components/AssetBatchTable';
import {assets} from './scripts/mobile-fixtures.mjs';
window.print=()=>{window.__printed=true;window.dispatchEvent(new Event('afterprint'))};
document.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault()});
createRoot(document.getElementById('root')).render(<><AppNav fullName="Synthetic Operator" role="admin"/><main className="container"><AssetBatchTable assets={assets}/></main></>);`;
  const client = await build({stdin:{contents:clientEntry,resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'browser',format:'iife',jsx:'automatic',plugins:[mocks],tsconfig:path.join(root,'tsconfig.json')});
  await page.setViewportSize({width:390,height:844});
  await page.setContent(`<html><head><style>${css}</style></head><body><div id="root"></div></body></html>`);
  await page.addScriptTag({content:client.outputFiles[0].text});
  const print = page.getByRole('button',{name:'Print selected labels (0)',exact:true});
  await print.waitFor();
  if (!await print.isDisabled()) failures.push('Client: empty print selection must be disabled');
  await page.getByRole('button',{name:'Select all shown',exact:true}).click();
  await page.getByRole('button',{name:'Print selected labels (2)',exact:true}).click();
  if (!await page.evaluate(()=>window.__printed && document.querySelectorAll('.asset-print-label svg').length===2 && !document.documentElement.classList.contains('asset-batch-printing'))) failures.push('Client: selected QR labels/print cleanup');
  await page.getByRole('button',{name:'Clear all',exact:true}).click();
  if (!await print.isDisabled()) failures.push('Client: clear selection');
  await page.locator('summary').click();
  const menuBounds = await page.locator('.nav-panel').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height}});
  if(menuBounds.left<0 || menuBounds.right>390 || menuBounds.height>844*.66) failures.push('Client: menu bounds');
  await page.keyboard.press('Escape');
  if(await page.locator('.nav-menu').evaluate(el=>el.open)) failures.push('Client: Escape closes menu');
  await page.locator('summary').click();
  await page.locator('.nav-panel').getByRole('link',{name:'Assets',exact:true}).click();
  if(await page.locator('.nav-menu').evaluate(el=>el.open)) failures.push('Client: navigation closes menu');
  await page.screenshot({path:path.join(output,'assets-mobile.png'),fullPage:false});
  results.push({file:'client interactions',width:390,checks:['select all','QR label count','print cleanup','clear selection','bounded menu','Escape','navigation close']});
} finally { await browser.close(); }
fs.writeFileSync(path.join(output, "report.json"), JSON.stringify({ scope: "Isolated SSR of real page/component code with synthetic DB/action/Next boundaries; not live authenticated data or backend testing", routeCount: pages.length, documents: fixtures.OPERATIONAL_DOCUMENTS.length, results, failures }, null, 2));
console.log(`Rendered mobile QA: ${pages.length} routes, ${fixtures.OPERATIONAL_DOCUMENTS.length} documents, ${results.length} viewport/state checks. Report: ${output}/report.json`);
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("PASS: rendered layout checks at 320, 390, 768 and 1280px.");
