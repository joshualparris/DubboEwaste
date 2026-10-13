import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsPath = path.join(appRoot, "app/(private)/projects/page.tsx");
const source = fs.readFileSync(projectsPath, "utf8");
const ownOrigin = "https://dubbo-ewaste-app.vercel.app";
const urls = [...source.matchAll(/\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"/g)]
  .map((match) => ({ name: match[1], url: match[2] }));
assert.ok(urls.length >= 20, "Too few projects links parsed; update link validator");
const seen = new Set();

for (const { name, url } of urls) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, "https:", name + " must use HTTPS");
  assert.ok(!seen.has(url), name + " duplicates a link");
  seen.add(url);
  assert.notEqual(parsed.hostname, "parris-tech-services.github.io", "DadLAN GitHub Pages deployment is unavailable");
  if (parsed.origin !== ownOrigin) continue;
  const pathname = decodeURIComponent(parsed.pathname);
  if (pathname === "/") continue;
  const segments = pathname.replace(/^\/|\/$/g, "");
  const candidates = [
    path.join(appRoot, "app", segments, "page.tsx"),
    path.join(appRoot, "app/(private)", segments, "page.tsx"),
    path.join(appRoot, "public", segments),
  ];
  assert.ok(candidates.some((item) => fs.existsSync(item)), name + " points at a missing local route: " + pathname);
}

const snapshot = path.join(appRoot, "public/dadlan-rollout.html");
const html = fs.readFileSync(snapshot, "utf8");
assert.match(html, /DadLAN Control Centre/);
assert.match(html, /Static public-safe snapshot/);
assert.ok(!/<script\b/i.test(html), "Static snapshot should not contain scripts");
const proxy = fs.readFileSync(path.join(appRoot, "proxy.ts"), "utf8");
assert.ok(proxy.includes('"/dadlan-rollout.html"'), "Allow public snapshot in route access list");
assert.ok(urls.some(({ name, url }) => name === "DadLAN rollout snapshot" && url === ownOrigin + "/dadlan-rollout.html"));
console.log("Projects link QA PASS: " + urls.length + " links, app-owned routes exist, DadLAN snapshot bundled and public.");
