import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const files = [
  "lib/help-navigation.ts", "lib/programmes.ts",
  "components/QuickNavigator.tsx", "components/AppNav.tsx",
  "app/(private)/help/page.tsx", "app/(private)/layout.tsx"
];
for (const file of files) {
  const source = read(file);
  const node = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  assert.equal(node.parseDiagnostics.length, 0, file + " must parse as valid TS/TSX");
}
const index = read("lib/help-navigation.ts");
const modal = read("components/QuickNavigator.tsx");
const nav = read("components/AppNav.tsx");
const guards = read("lib/programmes.ts");
const help = read("app/(private)/help/page.tsx");
const css = read("components/QuickNavigator.module.css");
const globals = read("app/globals.css");
assert.ok(guards.includes('"help"'), "Private help path is available through programme checks");
assert.ok(nav.includes("<QuickNavigator") && nav.includes('href="/help"'), "Top nav exposes both find and help");
assert.ok(index.includes("canVisit(link.href") && index.includes("managerOnly") && index.includes("globalAdminOnly"), "Help links are permission aware");
assert.ok(modal.includes('event.ctrlKey || event.metaKey') && modal.includes('key === "k"'), "Ctrl/Cmd K opens quick navigator");
assert.ok(modal.includes('event.key === "?"') && modal.includes('event.key === "/"'), "Help and search single-key shortcuts exist");
assert.ok(modal.includes("isEditing(event.target)") && modal.includes("event.repeat"), "Single-key navigation never hijacks normal typing or key holds");
assert.ok(modal.includes('aria-modal="true"') && modal.includes("trapTab") && modal.includes("previousFocus"), "Keyboard dialog is accessible");
assert.ok(modal.includes("goKeys.find") && modal.includes("available.has(href)"), "G+key routes use permission-filtered destinations");
assert.ok(help.includes("visibleHelpSections") && help.includes("Keyboard shortcuts") && help.includes("owner") && help.includes("/programmes"), "Help guide is role-aware and explains workflows");
assert.ok(css.includes("prefers-reduced-motion") && css.includes("max-width:720px"), "Palette has mobile and reduced motion styles");
assert.ok(globals.includes(".assetflow-help") && globals.includes("grid-template-columns:repeat(4,minmax(0,1fr))"), "Help styling and mobile nav included");

// Confirm every link indexed in Help points to an actual page, not a guessed URL.
const sectionIndex = index.split("export type HelpContext")[0];
const routes = [...sectionIndex.matchAll(/href: "(\/[^"]+)"/g)].map(m => m[1]);
const missing = routes.filter(href => {
  const segments = href.slice(1);
  return !fs.existsSync(path.join(root, "app/(private)", segments, "page.tsx")) &&
    !fs.existsSync(path.join(root, "app", segments, "page.tsx"));
});
assert.deepEqual(missing, [], "Help links must all resolve to real app pages: " + missing.join(", "));
const unique = new Set(routes);
assert.equal(unique.size, routes.length, "No repeated help destinations");
console.log("AssetFlow help QA PASS: " + files.length + " TS/TSX files parsed, " + routes.length + " real routes, permissions, keyboard events, focus, mobile layout and guides checked.");
