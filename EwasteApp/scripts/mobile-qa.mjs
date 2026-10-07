import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(here, "../app");
const cssPath = path.resolve(appDir, "globals.css");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const pages = walk(appDir)
  .filter((file) => file.endsWith(`${path.sep}page.tsx`))
  .sort();

const issues = [];

for (const file of pages) {
  const source = fs.readFileSync(file, "utf8");
  const routeFile = path.relative(path.resolve(here, ".."), file).replaceAll(path.sep, "/");

  const hasTable = /<table\\b/.test(source);
  const hasSafeTableContainer =
    /table-wrap/.test(source) ||
    /overflowX\\s*:\\s*["']auto/.test(source) ||
    /table\\s*\\{[^}]*overflow-x\\s*:\\s*auto/s.test(source);

  if (hasTable && !hasSafeTableContainer) {
    issues.push(`${routeFile}: table without a mobile overflow container`);
  }

  if (/<pre\\b/.test(source) && !/(overflowWrap|overflow\\s*:|doc-code|whiteSpace:\\s*["']pre-wrap)/.test(source)) {
    issues.push(`${routeFile}: <pre> content has no overflow/wrap protection`);
  }

  for (const match of source.matchAll(/(?:minWidth|width)\\s*:\\s*["'](\\d+)px["']/g)) {
    if (Number(match[1]) >= 360) {
      issues.push(`${routeFile}: inline fixed width ${match[1]}px can exceed a phone viewport`);
    }
  }
}

const css = fs.readFileSync(cssPath, "utf8");
const requiredCss = [
  ["root horizontal containment", /html, body[\\s\\S]*overflow-x:\\s*hidden/],
  ["container width containment", /\\.container\\{[^}]*width:100%/],
  ["grid child min-width reset", /\\.stack>\\*,\\.grid>\\*,\\.two>\\*\\{min-width:0\\}/],
  ["responsive auto-fit grid", /minmax\\(min\\(220px,100%\\),1fr\\)/],
  ["table wrapper width containment", /\\.table-wrap\\{[^}]*max-width:100%[^}]*overflow-x:auto/],
  ["mobile container padding", /@media\\(max-width:720px\\)[\\s\\S]*\\.container\\{padding:20px 14px 48px\\}/],
];

for (const [label, pattern] of requiredCss) {
  if (!pattern.test(css)) issues.push(`globals.css: missing ${label}`);
}

if (pages.length < 46) {
  issues.push(`Expected at least 46 page routes, found ${pages.length}`);
}

console.log(`Mobile QA checked ${pages.length} route pages:`);
for (const file of pages) {
  console.log(`  PASS ${path.relative(appDir, file).replaceAll(path.sep, "/")}`);
}

if (issues.length) {
  console.error("\\nMobile QA failed:");
  for (const issue of issues) console.error(`  - ${issue}`);
  process.exit(1);
}

console.log("\\nMobile QA PASS: no page-level horizontal-overflow hazards found by the source audit.");
