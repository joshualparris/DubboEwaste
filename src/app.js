(() => {
"use strict";
const DATA = JSON.parse(document.getElementById("docs-data").textContent);
const DOCS = DATA.docs;
const BY_ID = Object.fromEntries(DOCS.map(d => [d.id, d]));
const BY_PATH = Object.fromEntries(DOCS.map(d => [d.path, d]));
const GROUP_LABEL = Object.fromEntries(DATA.meta.groups.map(g => [g.id, g.label]));
const main = document.getElementById("main");
const KEY = "dubbo-ewaste-field-school-v1";

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const GLOSSARY_SETTINGS_KEY = "dubbo-ewaste-glossary-hints";
let glossaryHints = (() => { try { return localStorage.getItem(GLOSSARY_SETTINGS_KEY) !== "off"; } catch { return true; } })();
const glossarySlug = s => "term-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const jargonTerms = (() => {
  const out = new Map();
  const add = (alias, term, def) => { if (alias && !out.has(alias.toLowerCase())) out.set(alias.toLowerCase(), {term, def}); };
  C.glossary.forEach(([term, def]) => {
    add(term, term, def);
    term.split("/").forEach(x => add(x.trim(), term, def));
    if (term.includes(":")) add(term.split(":")[0].trim(), term, def);
  });
  const extra = {"ANZRP": "ANZRP / TechCollect", "AS 5377": "AS 5377:2022", "CRT": "CRT / CRTs", "CRTs": "CRT / CRTs", "certificate": "Certificate of recycling / sanitisation certificate", "certificates": "Certificate of recycling / sanitisation certificate", "sanitisation certificate": "Certificate of recycling / sanitisation certificate", "recycling certificate": "Certificate of recycling / sanitisation certificate"};
  Object.entries(extra).forEach(([alias, term]) => { const item = C.glossary.find(x => x[0] === term); if (item) add(alias, item[0], item[1]); });
  return [...out.entries()].sort((a, b) => b[0].length - a[0].length);
})();
const jargonPattern = jargonTerms.length ? new RegExp(`\\b(?:${jargonTerms.map(([x]) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi") : null;
const money = (n, dp = 0) => (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-AU", {minimumFractionDigits: dp, maximumFractionDigits: dp});
const readMins = d => Math.max(1, Math.round(d.words / 230));
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2400); }
function linkHtml(l) {
  if (l.doc) { const d = BY_ID[l.doc]; return d ? `<a class="int" href="#doc-${esc(l.doc)}">${esc(l.t)}</a>` : ""; }
  if (l.q) return `<a href="https://www.google.com/search?q=${encodeURIComponent(l.q)}" target="_blank" rel="noopener" title="Web search">${esc(l.t)} <span class="muted">(search)</span></a>`;
  return `<a href="${esc(l.u)}" target="_blank" rel="noopener">${esc(l.t)}</a>`;
}
function docLink(id, label) { const d = BY_ID[id]; return d ? `<a class="int" href="#doc-${esc(id)}">${esc(label || d.title)}</a>` : ""; }
function enhanceJargon() {
  document.body.classList.toggle("glossary-off", !glossaryHints);
  if (!glossaryHints || !jargonPattern) return;
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (!node.nodeValue.trim() || node.parentElement.closest("a,button,input,textarea,select,code,pre,script,style,.jargon-popover")) return;
    jargonPattern.lastIndex = 0;
    if (!jargonPattern.test(node.nodeValue)) return;
    jargonPattern.lastIndex = 0;
    const frag = document.createDocumentFragment(); let last = 0;
    for (const match of node.nodeValue.matchAll(jargonPattern)) {
      const alias = match[0], item = jargonTerms.find(([x]) => x.toLowerCase() === alias.toLowerCase())?.[1]?.term;
      if (!item) continue;
      const def = C.glossary.find(x => x[0] === item); if (!def) continue;
      frag.append(document.createTextNode(node.nodeValue.slice(last, match.index)));
      const b = document.createElement("button"); b.type = "button"; b.className = "jargon"; b.dataset.term = item; b.dataset.tip = def[1]; b.setAttribute("aria-label", `Explain ${alias}`); b.textContent = alias;
      frag.append(b); last = match.index + alias.length;
    }
    frag.append(document.createTextNode(node.nodeValue.slice(last))); node.replaceWith(frag);
  });
}
function showJargon(button) {
  const item = C.glossary.find(x => x[0] === button.dataset.term); const pop = $("#jargonPopover"); if (!item || !pop) return;
  pop.innerHTML = `<h3>${esc(item[0])}</h3><p>${esc(item[1])}</p><a href="glossary.html#${glossarySlug(item[0])}">Open in glossary →</a>`;
  pop.hidden = false; const r = button.getBoundingClientRect(); pop.style.left = `${Math.max(14, Math.min(r.left, innerWidth - pop.offsetWidth - 14))}px`; pop.style.top = `${Math.min(innerHeight - pop.offsetHeight - 14, r.bottom + 10)}px`;
}
async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); toast("Copied"); }
  catch { const r = document.createRange(); const el = btn?.previousElementSibling; if (el) { r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Selected. Press Ctrl+C to copy"); } }
}

/* ---------- state ---------- */
const DEFAULT = () => ({v: 1, updatedAt: 0, checks: {}, read: {}, cards: {}, quiz: {seen: 0, right: 0, missed: {}}, log: {parking: "", questions: [], wrong: [], glossary: [], recalls: [], notes: []}, contacts: {}, calc: null, track: "A", planStart: "", wizard: {}});
function merge(s) {
  const d = DEFAULT();
  if (!s || typeof s !== "object") return d;
  return {...d, ...s, quiz: {...d.quiz, ...(s.quiz || {})}, log: {...d.log, ...(s.log || {})}};
}
let S = (() => { try { const r = localStorage.getItem(KEY); return r ? merge(JSON.parse(r)) : DEFAULT(); } catch { return DEFAULT(); } })();
let remote = null, writing = false, dirty = false, wTimer = null, syncMode = "local";
function save(silent) {
  S.updatedAt = Date.now();
  if (S.log.recalls.length > 150) S.log.recalls = S.log.recalls.slice(-150);
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
  if (remote) { dirty = true; clearTimeout(wTimer); wTimer = setTimeout(flush, 1200); }
  renderSync();
}
async function flush() {
  if (!remote || writing || !dirty) return;
  writing = true; dirty = false;
  try { await remote.set(JSON.parse(JSON.stringify(S))); syncMode = "cloud"; }
  catch (e) {
    const code = e && e.code;
    if (code === "unavailable") { dirty = true; setTimeout(flush, 1500 + Math.random() * 2000); }
    else if (code === "quota_exceeded") { toast("Your saved data is too large to sync. Trim old recall notes."); }
    else { remote = null; syncMode = "local"; }
  } finally { writing = false; renderSync(); if (dirty && remote) { clearTimeout(wTimer); wTimer = setTimeout(flush, 1200); } }
}
function renderSync() {
  const el = $("#sync"); if (!el) return;
  el.className = "sync" + (syncMode === "cloud" ? " cloud" : "");
  el.textContent = syncMode === "cloud" ? (writing || dirty ? "Saving to your account…" : "Progress saved to your account") : "Progress saved in this browser";
}
async function initCloud() {
  if (!window.claude || !window.claude.use) return;
  try {
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
    if (!db || !user) return;
    const id = await user.id();
    if (!id) return;
    const ref = db.doc("data/users/" + id + "/state");
    const snap = await ref.get();
    remote = ref; syncMode = "cloud";
    if (snap.exists) {
      const r = snap.data() || {};
      if ((r.updatedAt || 0) > (S.updatedAt || 0)) {
        S = merge(JSON.parse(JSON.stringify(r)));
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
        route();
      } else if ((S.updatedAt || 0) > (r.updatedAt || 0)) { dirty = true; flush(); }
    } else if (S.updatedAt) { dirty = true; flush(); }
    renderSync();
  } catch { remote = null; syncMode = "local"; renderSync(); }
}
let samplePromise = null;
const getSample = () => (samplePromise ||= (window.claude && window.claude.use ? claude.use("sample").catch(() => null) : Promise.resolve(null)));
let downloadsPromise = null;
const getDownloads = () => (downloadsPromise ||= (window.claude && window.claude.use ? claude.use("downloads").catch(() => null) : Promise.resolve(null)));

/* ---------- derived progress ---------- */
function planInfo() {
  const tr = C.tracks[S.track] || C.tracks.A;
  let done = 0, total = 0;
  tr.weeks.forEach((w, i) => w.tasks.forEach((_, j) => { total++; if (S.checks[`${S.track}${i}-${j}`]) done++; }));
  let week = null;
  if (S.planStart) {
    const start = new Date(S.planStart + "T00:00:00");
    const diff = Math.floor((Date.now() - start) / 86400000);
    if (diff >= 0) week = Math.min(8, Math.floor(diff / 7) + 1);
  }
  return {tr, done, total, week};
}
function nowBlock() {
  const parts = new Intl.DateTimeFormat("en-AU", {timeZone: "Australia/Sydney", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short"}).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value;
  const hm = `${get("hour")}:${get("minute")}`.replace(/^24/, "00");
  const wd = get("weekday");
  const weekend = wd === "Sat" || wd === "Sun";
  const idx = weekend ? -1 : C.rhythm.findIndex(r => hm >= r[0] && hm < r[1]);
  return {hm, wd, weekend, idx};
}
const cardsDue = () => allCards().filter(c => { const st = S.cards[c[0]]; return !st || st.due <= today(); });
const allCards = () => [...C.glossary, ...S.log.glossary.filter(g => g.term && g.def).map(g => [g.term, g.def, "mine"])];

/* ---------- router ---------- */
const VIEWS = {home: viewHome, flow: viewFlow, rules: viewRules, plan: viewPlan, practice: viewPractice, money: viewMoney, people: viewPeople, log: viewLog, library: viewLibrary};
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || "home";
  let navKey = h;
  if (h.startsWith("doc-")) { viewDoc(h.slice(4)); navKey = "library"; }
  else if (h.startsWith("search-")) { viewSearch(h.slice(7)); navKey = "library"; }
  else (VIEWS[h] || viewHome)();
  $$("nav a").forEach(a => { if (a.dataset.nav === (VIEWS[navKey] ? navKey : "home")) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  $("#rail").classList.remove("open"); $("#railToggle").setAttribute("aria-expanded", "false");
  if (!h.includes("~sec-")) window.scrollTo(0, 0);
  enhanceJargon();
}
window.addEventListener("hashchange", route);
$("#railToggle").addEventListener("click", () => { const r = $("#rail"); r.classList.toggle("open"); $("#railToggle").setAttribute("aria-expanded", r.classList.contains("open")); });
$("#settingsToggle").addEventListener("click", () => { const p = $("#settingsPanel"), open = p.hidden; p.hidden = !open; $("#settingsToggle").setAttribute("aria-expanded", open); });
$("#glossaryHints").checked = glossaryHints;
$("#glossaryHints").addEventListener("change", e => { glossaryHints = e.target.checked; try { localStorage.setItem(GLOSSARY_SETTINGS_KEY, glossaryHints ? "on" : "off"); } catch {} $("#jargonPopover").hidden = true; route(); });
document.addEventListener("click", e => { const b = e.target.closest(".jargon"); if (b) { e.stopPropagation(); showJargon(b); } else if (!e.target.closest(".jargon-popover")) $("#jargonPopover").hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") { $("#jargonPopover").hidden = true; $("#settingsPanel").hidden = true; } });
$("#globalSearch").addEventListener("keydown", e => { if (e.key === "Enter" && e.target.value.trim()) { lastQuery = e.target.value.trim(); const h = "search-" + lastQuery.replace(/\s+/g, "_").replace(/[^A-Za-z0-9._~-]/g, ""); if (location.hash === "#" + h) route(); else location.hash = h; } });
let lastQuery = "";
window.addEventListener("resize", () => { if (typeof drawFlow === "function" && $(".flow")) drawFlow(); });

/* ---------- Home ---------- */
function viewHome() {
  const p = planInfo(), nb = nowBlock();
  const readCount = Object.keys(S.read).filter(k => BY_ID[k]).length;
  const mastered = Object.values(S.cards).filter(c => c.box >= 4).length;
  const gatesDone = C.gates.filter((_, i) => S.checks["gate" + i]).length;
  const wk = p.week ? p.tr.weeks[p.week - 1] : null;
  const slot = nb.idx >= 0 ? C.rhythm[nb.idx] : null;
  main.innerHTML = `<div class="page">
  <div class="hero">
    <div>
      <div class="eyebrow">Dubbo eWaste · research to practice</div>
      <h1>Get useful technology <em>before</em> the recycling system does.</h1>
  <p class="lede">Everything from the DubboEwaste research, turned into a place to learn it: how e-waste moves through Dubbo, the rules that govern it, an eight-week study plan, practice quizzes, a money model and every research document.</p>
      <p class="callout info" style="margin-top:14px">New to terms like <a href="glossary.html#term-ntcrs">NTCRS</a>, <a href="glossary.html#term-as-5377-2022">AS 5377</a>, <a href="glossary.html#term-crt-crts">CRTs</a> or <a href="glossary.html#term-certificate-of-recycling-sanitisation-certificate">certificates</a>? <a href="glossary.html">Open the plain-English glossary →</a></p>
    </div>
    <div class="today" aria-label="Today">
      <div class="eyebrow">${nb.weekend ? "Weekend" : esc(nb.wd) + " · " + esc(nb.hm) + " Dubbo time"}</div>
      <h3>${nb.weekend ? "Nothing planned. Family time." : slot ? esc(slot[2]) : "Outside study hours"}</h3>
      <p>${nb.weekend ? "The plan keeps weekends free so it doesn't leak into family time." : slot ? esc(slot[3]) : "Study blocks run 9:00–5:00 on weekdays. The next block is on the Study plan page."}</p>
      ${wk ? `<p><b style="color:inherit">Week ${p.week}: ${esc(wk.t)}.</b> Deliverable: ${esc(wk.d)}.</p>` : `<p>Set a start date on the Study plan page and this card will track your week.</p>`}
      <div class="bar"><i style="width:${p.total ? Math.round(p.done / p.total * 100) : 0}%"></i></div>
      <div class="row"><a class="btn small" href="#plan">Open study plan</a><a class="btn small" href="#practice">Practise ${cardsDue().length} due cards</a></div>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><b>${p.done}/${p.total}</b><span>${esc(p.tr.name)} tasks done</span></div>
    <div class="stat"><b>${readCount}/${DOCS.length}</b><span>Research docs read</span></div>
    <div class="stat"><b>${mastered}</b><span>Flashcards mastered</span></div>
    <div class="stat"><b>${gatesDone}/${C.gates.length}</b><span>Launch gates cleared</span></div>
  </div>

  <section class="sec">
    <div class="sec-head"><h2 class="sec-title">The workflow the research supports</h2><span class="sec-note">Tap a step.</span></div>
    <div class="pipeline" role="group" aria-label="Workflow steps">${C.pipeline.map((s, i) => `<button class="pipe-step" data-step="${i}" aria-pressed="${i === 0}"><small>${String(i + 1).padStart(2, "0")}</small>${esc(s[0])}</button>`).join("")}</div>
    <div class="pipe-detail" id="pipeDetail"></div>
    <p class="sec-note">This isn't "open a place where people dump old electronics". Dubbo already has disposal routes. The open opportunity is reuse before destruction.</p>
  </section>

  <section class="sec">
    <h2 class="sec-title">Four streams, not business versus charity</h2>
    <div class="streams">${C.streams.map((s, i) => `<div class="card stream s${i + 1}"><h3>${esc(s[0])}</h3><p class="prose-sm">${esc(s[1])}</p></div>`).join("")}</div>
  </section>

  <div class="grid g2">
    <section class="sec">
      <h2 class="sec-title">Ten takeaways from all the research</h2>
      <div>${C.takeaways.map((t, i) => `<details class="acc"${i === 0 ? " open" : ""}><summary>${esc(t[0])}</summary><div class="acc-body"><p>${esc(t[1])}</p><p>${docLink(t[2], "Read the evidence →")}</p></div></details>`).join("")}</div>
    </section>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">Launch gates, in order</h2><span class="sec-note">Tick them as you clear them.</span></div>
      <div class="card">${C.gates.map((g, i) => `<label class="gate${S.checks["gate" + i] ? " done" : ""}"><span class="n">${i + 1}</span><span><span class="row"><b class="gt">${esc(g[0])}</b><input type="checkbox" data-check="gate${i}" ${S.checks["gate" + i] ? "checked" : ""} aria-label="Cleared"></span><p>${esc(g[1])}</p></span></label>`).join("")}</div>
      <p class="sec-note">Don't lease a warehouse because the concept feels exciting.</p>
    </section>
  </div>

  <div class="grid g2">
    <section class="sec">
      <h2 class="sec-title">Five biggest unanswered questions</h2>
      <div>${C.unknowns.map(u => `<details class="acc"><summary>${esc(u[0])}</summary><div class="acc-body"><p>${esc(u[1])}</p></div></details>`).join("")}</div>
    </section>
    <section class="sec">
      <h2 class="sec-title">Claims not to make yet</h2>
      <div class="card"><ul class="list">${C.dontClaim.map(c => `<li>${esc(c)}</li>`).join("")}</ul><p class="sec-note">Each is unresolved or unsupported until new evidence closes it.</p></div>
    </section>
  </div>
  <p class="sec-note">Built from <a href="${esc(DATA.meta.repo)}" target="_blank" rel="noopener">joshualparris/DubboEwaste</a> at commit <span class="mono">${esc(DATA.meta.commit)}</span>. Research stage only, not legal advice.</p>
  </div>`;
  const showStep = i => { $$(".pipe-step").forEach(b => b.setAttribute("aria-pressed", b.dataset.step == i)); $("#pipeDetail").innerHTML = `<b>${esc(C.pipeline[i][1])}.</b> ${esc(C.pipeline[i][2])}`; };
  showStep(0);
  $$(".pipe-step").forEach(b => b.addEventListener("click", () => showStep(+b.dataset.step)));
}

/* ---------- Flow ---------- */
let flowSel = null;
function viewFlow() {
  const cols = C.flowCols.map((c, i) => `<div class="flow-col"><h4>${esc(c)}</h4>${C.flowNodes.filter(n => n.col === i).map(n => `<button class="node ${n.c}" data-node="${n.id}" aria-pressed="false"><b>${esc(n.t)}</b><small>${esc(n.s)}</small></button>`).join("")}</div>`).join("");
  const sw = (cls, dash) => `<svg width="28" height="8" aria-hidden="true"><line x1="0" y1="4" x2="28" y2="4" class="${cls}" stroke-width="2" ${dash ? `stroke-dasharray="${dash}"` : ""} style="stroke:var(--${cls === "v" ? "ok" : cls === "u" ? "bad" : cls === "h" ? "warn" : "copper"})"/></svg>`;
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Where it goes</div><h1>Follow a Dubbo laptop from drawer to smelter</h1>
  <p class="lede">What the research can prove about each step, what is only historical, and where the trail goes cold. Select any box to light up its routes.</p></div>
  <div class="legend">
    <span>${sw("v")} Evidenced</span><span>${sw("h", "2 4")} Historical</span><span>${sw("u", "6 5")} Unproven or unknown</span><span>${sw("p", "10 4")} Proposed Dubbo eWaste route</span>
  </div>
  <div class="flow-wrap"><div class="flow" id="flow"><svg class="flow-svg" id="flowSvg" aria-hidden="true"></svg>${cols}</div></div>
  <div class="flow-detail" id="flowDetail"></div>
  <section class="sec">
    <h2 class="sec-title">What would close the gap</h2>
    <div class="grid g3">
      <div class="card"><h3>A written answer from AMR</h3><p class="prose-sm">The legal name and street address of the first facility that receives Dubbo e-waste, and whether it is AS 5377 certified.</p>${docLink("CALL-SCRIPTS", "AMR questions →")}</div>
      <div class="card"><h3>A transport or weight document</h3><p class="prose-sm">A consignment note, weight ticket or certificate of recycling that names the receiving facility and date.</p>${docLink("AMR-DUBBO-DOWNSTREAM-FORENSIC", "What counts as proof →")}</div>
      <div class="card"><h3>Council's current contract</h3><p class="prose-sm">The Matthews contract expired on 30 June 2025. A GIPA request or a call can name Council's current e-waste contractor.</p>${docLink("BACKLOG-06-12-DOWNSTREAM-STEWARDSHIP", "Contract research →")}</div>
    </div>
  </section></div>`;
  $$(".node").forEach(b => b.addEventListener("click", () => selectNode(b.dataset.node === flowSel ? null : b.dataset.node)));
  requestAnimationFrame(() => { drawFlow(); selectNode(flowSel || "amr"); });
  if (document.fonts) document.fonts.ready.then(() => $(".flow") && drawFlow());
}
function drawFlow() {
  const flow = $("#flow"), svg = $("#flowSvg"); if (!flow || !svg) return;
  const box = flow.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
  svg.innerHTML = C.flowEdges.map(([a, b, c]) => {
    const A = $(`[data-node="${a}"]`, flow)?.getBoundingClientRect(), B = $(`[data-node="${b}"]`, flow)?.getBoundingClientRect();
    if (!A || !B) return "";
    const x1 = A.right - box.left, y1 = A.top + A.height / 2 - box.top, x2 = B.left - box.left, y2 = B.top + B.height / 2 - box.top;
    const mx = (x1 + x2) / 2;
    return `<path class="${c}" data-a="${a}" data-b="${b}" d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}"/>`;
  }).join("");
  if (flowSel) selectNode(flowSel, true);
}
function selectNode(id, quiet) {
  flowSel = id;
  const flow = $("#flow"); if (!flow) return;
  flow.classList.toggle("focus", !!id);
  $$(".node", flow).forEach(n => { n.setAttribute("aria-pressed", n.dataset.node === id); n.classList.remove("lit"); });
  $$(".flow-svg path", flow).forEach(p => p.classList.remove("lit"));
  if (!id) { $("#flowDetail").innerHTML = ""; return; }
  const linked = new Set([id]);
  C.flowEdges.forEach(([a, b]) => { if (a === id || b === id) { linked.add(a); linked.add(b); } });
  linked.forEach(n => $(`[data-node="${n}"]`, flow)?.classList.add("lit"));
  $$(".flow-svg path", flow).forEach(p => { if (p.dataset.a === id || p.dataset.b === id) p.classList.add("lit"); });
  if (quiet) return;
  const n = C.flowNodes.find(x => x.id === id), conf = C.flowConf[n.c];
  const out = C.flowEdges.filter(e => e[0] === id), inc = C.flowEdges.filter(e => e[1] === id);
  const nm = k => C.flowNodes.find(x => x.id === k).t;
  const edgeList = (arr, idx) => arr.length ? `<ul class="list tight">${arr.map(e => `<li><button class="btn ghost small" data-jump="${e[idx]}">${esc(nm(e[idx]))}</button> <span class="chip ${C.flowConf[e[2]][0]}">${esc(C.flowConf[e[2]][1])}</span></li>`).join("")}</ul>` : `<p class="muted">None shown.</p>`;
  $("#flowDetail").innerHTML = `<div class="card raised"><div class="row"><span class="chip ${conf[0]}">${esc(conf[1])}</span></div><h3>${esc(n.t)}</h3><p class="prose-sm">${esc(n.d)}</p>
    <div class="links">${(n.docs || []).map(d => docLink(d)).join("")}${(n.links || []).map(linkHtml).join("")}</div></div>
    <div class="card"><h3>Comes from</h3>${edgeList(inc, 0)}<h3>Goes to</h3>${edgeList(out, 1)}</div>`;
  $$("[data-jump]").forEach(b => b.addEventListener("click", () => selectNode(b.dataset.jump)));
}

/* ---------- Rules ---------- */
function viewRules() {
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Rules and licences</div><h1>The rules, layer by layer</h1>
  <p class="lede">Each rule uses the three-line note from your study method: what it requires, who it applies to, and what you're still unsure of. Status tags show how solid the source is.</p></div>
  <section class="sec"><h2 class="sec-title">Work it out</h2>
    <div class="tabs" role="tablist">${Object.entries(C.wizards).map(([k, w], i) => `<button class="tab" role="tab" data-wiz="${k}" aria-selected="${i === 0}">${esc(w.title)}</button>`).join("")}</div>
    <div class="card raised" id="wizard"></div>
  </section>
  ${C.layers.map(l => `<section class="layer"><h3>${esc(l.t)}</h3><div class="grid g2">${l.items.map(it => `<article class="card law"><div class="law-head"><h3>${esc(it.t)}</h3><span class="chip ${it.st[0]}">${esc(it.st[1])}</span></div>
    <div class="three"><div><b>Requires</b><span>${esc(it.req)}</span></div><div><b>Applies to</b><span>${esc(it.who)}</span></div><div class="unsure"><b>Unsure</b><span>${esc(it.unsure)}</span></div></div>
    <div class="links">${it.links.map(linkHtml).join("")}</div></article>`).join("")}</div></section>`).join("")}
  <section class="sec"><div class="sec-head"><h2 class="sec-title">Out of date: use this instead</h2><span class="sec-note">Corrections from the research and the repo's correction register.</span></div>
    <div class="card">${C.fixes.map(f => `<div class="fix"><span class="old">${esc(f[0])}</span><span class="arrow">→</span><span>${esc(f[1])}</span></div>`).join("")}</div>
    <p class="sec-note">${docLink("BACKLOG-30-32-OPERATIONS-CORRECTIONS", "Full correction register →")} · ${docLink("agyDOCS~00-CORRECTIONS-AND-CAVEATS", "Caveats on the agyDOCS guides →")}</p>
  </section>
  <section class="sec"><h2 class="sec-title">Double-check before relying on it</h2>
    <div class="grid g3">${C.doubleCheck.map(d => `<div class="card"><h3>${esc(d[0])}</h3><p class="prose-sm muted">${esc(d[1])}</p></div>`).join("")}</div>
    <div class="callout info">Read primary sources on legislation.nsw.gov.au and the federal register, not summaries. Many links here are web searches because the exact page couldn't be verified while building this site.</div>
  </section></div>`;
  const first = Object.keys(C.wizards)[0];
  $$("[data-wiz]").forEach(b => b.addEventListener("click", () => { $$("[data-wiz]").forEach(x => x.setAttribute("aria-selected", x === b)); runWizard(b.dataset.wiz); }));
  runWizard(first);
}
function runWizard(key, path) {
  const w = C.wizards[key];
  path = path || S.wizard[key] || [];
  let node = w.start;
  const trail = [];
  for (const ans of path) { const q = w.nodes[node]; if (!q) break; const opt = q.o[ans]; if (!opt) break; trail.push(opt[0]); node = opt[1]; }
  const el = $("#wizard");
  const res = w.results[node], q = w.nodes[node];
  el.innerHTML = `<div class="wizard"><p class="muted">${esc(w.intro)}</p>
    ${trail.length ? `<div class="wiz-trail">${trail.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
    ${q ? `<div class="wiz-q">${esc(q.q)}</div>${q.hint ? `<p class="wiz-hint">${esc(q.hint)}</p>` : ""}<div class="wiz-opts">${q.o.map((o, i) => `<button class="btn" data-ans="${i}">${esc(o[0])}</button>`).join("")}</div>` : ""}
    ${res ? `<div class="result ${res.tone}"><h4>${esc(res.t)}</h4>${res.b.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      <div><h4 style="font-size:15px;margin-bottom:6px">Ask them</h4><ul class="list">${w.ask.map(a => `<li>${esc(a)}</li>`).join("")}</ul><p class="sec-note" style="margin-top:8px">${esc(w.call)}</p></div>` : ""}
    <div class="row">${path.length ? `<button class="btn ghost small" data-back>Back</button><button class="btn ghost small" data-reset>Start again</button>` : ""}</div></div>`;
  $$("[data-ans]", el).forEach(b => b.addEventListener("click", () => { S.wizard[key] = [...path, +b.dataset.ans]; save(); runWizard(key); }));
  $("[data-back]", el)?.addEventListener("click", () => { S.wizard[key] = path.slice(0, -1); save(); runWizard(key); });
  $("[data-reset]", el)?.addEventListener("click", () => { S.wizard[key] = []; save(); runWizard(key); });
}

/* ---------- Plan ---------- */
function viewPlan() {
  const p = planInfo(), nb = nowBlock();
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Study plan</div><h1>Eight weeks, desk-friendly</h1>
  <p class="lede">Two tracks. Rules and business comes from your research notes; bench skills comes from the repo's skills research. Tasks you tick are saved.</p></div>
  <div class="row">
    <div class="tabs" role="tablist" style="border:0">${Object.entries(C.tracks).map(([k, t]) => `<button class="tab" role="tab" data-track="${k}" aria-selected="${S.track === k}">${esc(t.name)}</button>`).join("")}</div>
    <span class="spacer"></span>
    <label class="field" style="flex-direction:row;align-items:center;gap:8px" for="planStart"><span>Start date</span><input type="date" id="planStart" value="${esc(S.planStart)}" style="width:auto"></label>
  </div>
  <div><div class="row" style="justify-content:space-between"><span class="muted">${esc(p.tr.sub)}</span><span class="mono tnum muted">${p.done}/${p.total} tasks</span></div><div class="progress" style="margin-top:8px"><i style="width:${p.total ? p.done / p.total * 100 : 0}%"></i></div></div>
  <div class="weeks">${p.tr.weeks.map((w, i) => {
    const keys = w.tasks.map((_, j) => `${S.track}${i}-${j}`), done = keys.filter(k => S.checks[k]).length;
    const cur = p.week === i + 1;
    return `<details class="week${cur ? " current" : ""}"${cur || (!p.week && i === 0) ? " open" : ""}><summary><span class="wk-n">WK ${i + 1}</span><span class="wk-t"><b>${esc(w.t)}</b><span>${esc(w.f)}</span></span><span class="wk-p tnum">${done}/${keys.length}${cur ? " · this week" : ""}</span></summary>
    <div class="wk-body"><div><h5>Do</h5>${w.tasks.map((t, j) => `<label class="check${S.checks[keys[j]] ? " done" : ""}"><input type="checkbox" data-check="${keys[j]}" ${S.checks[keys[j]] ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}
      <div class="deliv" style="margin-top:10px"><b>Deliverable</b>${esc(w.d)}</div></div>
      <div><h5>Read and watch</h5><div class="readings">${w.read.map(r => `<div><span class="kind">${r.doc ? "repo" : r.q ? "search" : "web"}</span>${linkHtml(r)}</div>`).join("")}</div></div></div></details>`;
  }).join("")}</div>

  <section class="sec"><div class="sec-head"><h2 class="sec-title">Daily rhythm, Monday to Friday</h2><span class="sec-note">${nb.weekend ? "It's the weekend. Nothing planned." : "Dubbo time now: " + esc(nb.hm)}</span></div>
    <div class="rhythm">${C.rhythm.map((r, i) => `<div class="slot${i === nb.idx ? " now" : ""}"><time>${r[0]}–${r[1]}</time><b>${esc(r[2])}</b><p>${esc(r[3])}</p></div>`).join("")}</div>
    <div class="callout warn">Since you work at Avance, check whether using work hours or gear for a side venture is okay with them. It's easier to sort out now than later.</div>
  </section>

  <section class="sec"><h2 class="sec-title">How to study so it sticks</h2>
    <p class="sec-note">Dunlosky et al. (2013) rated ten common techniques. A study of 703 students found quizzes embedded in online lectures improved learning, but only in low-distraction settings, and phone calls are your distraction.</p>
    <div class="utility">${C.techniques.map(t => `<div class="card ${t[0]}"><span class="eyebrow">${esc(t[1])}</span><h3>${esc(t[2])}</h3><p class="prose-sm muted">${esc(t[3])}</p></div>`).join("")}</div>
    <div class="grid g3">${C.howTo.map(h => `<div class="card"><h3>${esc(h[0])}</h3><p class="prose-sm">${esc(h[1])}</p></div>`).join("")}</div>
    <p class="sec-note">Most of this evidence comes from students in lab settings, not adults studying between phone calls. The interruption advice is reasoning, not a finding. Desk-bound swaps: virtual facility tours instead of site visits, email first then scheduled phone calls, and run the data-wiping lab on your own spare drives or a VM.</p>
  </section></div>`;
  $$("[data-track]").forEach(b => b.addEventListener("click", () => { S.track = b.dataset.track; save(); viewPlan(); }));
  $("#planStart").addEventListener("change", e => { S.planStart = e.target.value; save(); viewPlan(); });
}

/* ---------- Practice ---------- */
let practiceTab = "cards", flashIdx = 0, flashShown = false, quizRound = null;
const INTERVALS = [0, 1, 3, 7, 14, 30];
function viewPractice() {
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Practice</div><h1>Retrieve it, don't reread it</h1>
  <p class="lede">Practice testing and spaced practice are the two study techniques with the strongest evidence. Cards come back on a schedule, and the quiz explains every answer.</p></div>
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" data-pt="cards" aria-selected="${practiceTab === "cards"}">Flashcards</button>
    <button class="tab" role="tab" data-pt="quiz" aria-selected="${practiceTab === "quiz"}">Quiz</button>
    <button class="tab" role="tab" data-pt="recall" aria-selected="${practiceTab === "recall"}">Recall from a doc</button>
  </div>
  <div id="pt"></div></div>`;
  $$("[data-pt]").forEach(b => b.addEventListener("click", () => { practiceTab = b.dataset.pt; viewPractice(); }));
  ({cards: renderCards, quiz: renderQuiz, recall: renderRecall})[practiceTab]();
}
function renderCards() {
  const due = cardsDue(), all = allCards();
  const counts = [0, 0, 0, 0, 0];
  all.forEach(c => { const b = S.cards[c[0]]?.box || 0; counts[Math.min(4, b)]++; });
  const card = due[flashIdx % Math.max(1, due.length)];
  $("#pt").innerHTML = `<div class="grid g2" style="align-items:start">
    <div class="sec">${card ? `<div class="flash"><span class="eyebrow">${due.length} due today${card[2] === "mine" ? " · your term" : ""}</span><div class="term">${esc(card[0])}</div>
      ${flashShown ? `<div class="def">${esc(card[1])}</div><div class="row"><button class="btn" data-grade="0">Not yet</button><button class="btn primary" data-grade="1">Got it</button></div>` : `<p class="muted">Say or write the meaning, then check.</p><div class="row"><button class="btn primary" data-show>Show answer</button><button class="btn ghost" data-skip>Skip</button></div>`}</div>`
      : `<div class="flash"><span class="eyebrow">All caught up</span><div class="term">No cards due today.</div><p class="muted">Come back tomorrow, or add your own terms in the Learning log.</p></div>`}
    </div>
    <div class="sec"><h3 class="sec-title" style="font-size:17px">Your boxes</h3>
      <div class="boxes">${["New", "1 day", "3 days", "1 week", "2 wks+"].map((l, i) => `<div class="box"><b>${counts[i]}</b><span>${l}</span></div>`).join("")}</div>
      <p class="sec-note">Got it moves a card up a box and pushes it further out. Not yet sends it back to box 1. ${all.length} cards: ${C.glossary.length} from the research, ${all.length - C.glossary.length} of your own.</p>
      <a class="btn small" href="#log">Add your own terms</a></div></div>`;
  $("[data-show]")?.addEventListener("click", () => { flashShown = true; renderCards(); });
  $("[data-skip]")?.addEventListener("click", () => { flashIdx++; flashShown = false; renderCards(); });
  $$("[data-grade]").forEach(b => b.addEventListener("click", () => {
    const st = S.cards[card[0]] || {box: 0};
    const box = b.dataset.grade === "1" ? Math.min(5, (st.box || 0) + 1) : 1;
    const d = new Date(); d.setDate(d.getDate() + (b.dataset.grade === "1" ? INTERVALS[box] : 1));
    S.cards[card[0]] = {box, due: d.toISOString().slice(0, 10)};
    save(); flashShown = false; renderCards();
  }));
}
function newRound() {
  const missed = Object.keys(S.quiz.missed || {}).map(Number).filter(i => C.quiz[i]);
  const rest = C.quiz.map((_, i) => i).filter(i => !missed.includes(i)).sort(() => Math.random() - .5);
  const order = [...missed.sort(() => Math.random() - .5).slice(0, 4), ...rest].slice(0, 8);
  return {order, i: 0, right: 0, picked: null};
}
function renderQuiz() {
  if (!quizRound) quizRound = newRound();
  const r = quizRound, el = $("#pt");
  if (r.i >= r.order.length) {
    el.innerHTML = `<div class="card raised" style="max-width:640px"><span class="eyebrow">Round done</span><h3 style="font-size:28px">${r.right} of ${r.order.length}</h3><p class="prose-sm">Questions you miss come back first next round. All-time: ${S.quiz.right} right of ${S.quiz.seen}.</p><div class="row"><button class="btn primary" data-again>New round</button></div></div>`;
    $("[data-again]").addEventListener("click", () => { quizRound = newRound(); renderQuiz(); });
    return;
  }
  const qi = r.order[r.i], q = C.quiz[qi];
  el.innerHTML = `<div class="card raised" style="max-width:720px"><div class="row"><span class="eyebrow">Question ${r.i + 1} of ${r.order.length}</span><span class="spacer"></span><span class="mono muted tnum">${r.right} right</span></div>
    <h3 style="font-size:20px">${esc(q[0])}</h3><div class="mcq">${q[1].map((o, i) => `<button class="opt${r.picked !== null ? (i === q[2] ? " right" : i === r.picked ? " wrong" : "") : ""}" data-opt="${i}" ${r.picked !== null ? "disabled" : ""}>${esc(o)}</button>`).join("")}</div>
    ${r.picked !== null ? `<div class="callout${r.picked === q[2] ? "" : " warn"}">${r.picked === q[2] ? "Right. " : "Not quite. "}${esc(q[3])}</div><div class="row"><button class="btn primary" data-next>Next</button></div>` : ""}</div>`;
  $$("[data-opt]").forEach(b => b.addEventListener("click", () => {
    r.picked = +b.dataset.opt; S.quiz.seen++;
    if (r.picked === q[2]) { r.right++; S.quiz.right++; delete S.quiz.missed[qi]; } else S.quiz.missed[qi] = 1;
    save(); renderQuiz();
  }));
  $("[data-next]")?.addEventListener("click", () => { r.i++; r.picked = null; renderQuiz(); });
}
function renderRecall() {
  const read = Object.keys(S.read).filter(k => BY_ID[k]);
  const pool = read.length ? read : ["MASTER-FINDINGS-ALL-CHATS", "PHASE-0-OPERATING-BLUEPRINT", "LEGAL-LICENSING"].filter(k => BY_ID[k]);
  $("#pt").innerHTML = `<div class="grid g2" style="align-items:start"><div class="card raised"><h3>Pick a doc, then write what you remember</h3>
    <p class="prose-sm muted">Don't open it first. Write for two minutes, then check your notes against its headings.</p>
    <label class="field" for="recallDoc"><span>${read.length ? "Docs you've read" : "Suggested docs"}</span><select id="recallDoc">${pool.map(k => `<option value="${esc(k)}">${esc(BY_ID[k].title)}</option>`).join("")}</select></label>
    <label class="field" for="recallText"><span>What you remember</span><textarea id="recallText" rows="7" placeholder="Key points, numbers, who does what…"></textarea></label>
    <div class="row"><button class="btn primary" id="recallCheck">Check against the doc</button></div></div>
    <div class="card" id="recallOut"><h3>Then compare</h3><p class="muted">The doc's headings show up here so you can spot what you missed. Your note goes in the learning log.</p></div></div>`;
  $("#recallCheck").addEventListener("click", () => {
    const id = $("#recallDoc").value, text = $("#recallText").value.trim(), d = BY_ID[id];
    const heads = [...d.text.matchAll(/^#{2,3}\s+(.+)$/gm)].map(m => m[1].replace(/[*_`]/g, "")).slice(0, 30);
    if (text) { S.log.recalls.push({id: uid(), doc: id, text, date: today()}); save(); }
    $("#recallOut").innerHTML = `<h3>${esc(d.title)}</h3><p class="sec-note">${text ? "Saved to your learning log. " : ""}Which of these did you cover?</p><ul class="list">${heads.map(h => `<li>${esc(h)}</li>`).join("")}</ul>${docLink(id, "Open the doc →")}`;
  });
}

/* ---------- Money ---------- */
function viewMoney() {
  const v = {...C.calcDefaults, ...(S.calc || {})};
  const F = (k, label, step = 1, suffix = "") => `<label class="field" for="c_${k}"><span>${esc(label)}${suffix ? ` <span class="mono">(${suffix})</span>` : ""}</span><input id="c_${k}" type="number" inputmode="decimal" step="${step}" value="${esc(v[k])}" data-calc="${k}"></label>`;
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Money model</div><h1>Does it pay per hour of your time?</h1>
  <p class="lede">A pilot model built around the repo's key metric: gross margin per labour hour. The starting numbers are examples, not quotes or research findings. Replace them with eBay sold listings, recycler answers and insurer quotes as you get them.</p></div>
  <div class="callout">${S.calc ? "Showing your saved numbers." : "Example numbers. Change any field and your version is saved."} <button class="btn ghost small" id="calcReset">Reset to examples</button></div>
  <div class="calc">
    <div class="sec">
      <div class="card"><h3>Supply</h3><div class="inputs">${F("devices", "Devices accepted a month")}${F("reusePct", "Resold whole", 1, "%")}${F("partsPct", "Parted out", 1, "%")}</div><p class="sec-note">The rest goes to recycling.</p></div>
      <div class="card"><h3>Per resold device</h3><div class="inputs">${F("price", "Average sale price", 5, "$")}${F("partsCost", "Parts used", 1, "$")}${F("feePct", "Platform fee", .1, "%")}${F("post", "Postage and packaging", 1, "$")}${F("laborReuse", "Labour", 5, "min")}</div></div>
      <div class="card"><h3>Other devices</h3><div class="inputs">${F("partsValue", "Parts value per parted device", 1, "$")}${F("recycleCost", "Recycling cost per device", .5, "$")}${F("laborOther", "Labour per parted or recycled device", 5, "min")}</div></div>
      <div class="card"><h3>Fixed and risk</h3><div class="inputs">${F("insurance", "Insurance a month", 5, "$")}${F("storage", "Storage or rent a month", 5, "$")}${F("rate", "Hourly rate you want", 1, "$")}${F("incidentPct", "Chance of a fire or contamination incident a year", .5, "%")}${F("incidentCost", "Cost if it happens", 500, "$")}</div>
        <label class="check"><input type="checkbox" id="c_licence" ${v.licence ? "checked" : ""}><span>Include the second-hand dealer licence ($692 a year) and a business name ($47 a year)</span></label></div>
    </div>
    <div class="sec" id="calcOut"></div>
  </div>
  <section class="sec"><h2 class="sec-title">Single-item profit test</h2><p class="sec-note">Before you take on a device: resale price minus fees, postage, parts and time, against your hourly target.</p>
    <div class="card raised"><div class="inputs">
      <label class="field" for="t_price"><span>Expected sale price ($)</span><input id="t_price" type="number" value="220"></label>
      <label class="field" for="t_cost"><span>Parts, fees and postage ($)</span><input id="t_cost" type="number" value="45"></label>
      <label class="field" for="t_min"><span>Your minutes</span><input id="t_min" type="number" value="150"></label>
    </div><div id="testOut"></div></div></section>
  <section class="sec"><h2 class="sec-title">Benchmarks from the research</h2>
    <div class="table-wrap"><table class="data"><thead><tr><th>Item</th><th>Cost</th><th>Basis</th></tr></thead><tbody>${C.benchmarks.map(b => `<tr><td>${esc(b[0])}</td><td class="mono tnum">${esc(b[1])}</td><td>${esc(b[2])}</td></tr>`).join("")}</tbody></table></div>
    <p class="sec-note">Still unknown: insurance, any DA fee, premises remediation, and disposal costs for zero-value items. Don't budget the licence until Fair Trading says you need it. ${docLink("COSTS", "Cost notes →")} · ${docLink("BACKLOG-17-20-MARKET-COST-TAX", "Market, cost and tax →")}</p></section></div>`;
  const calc = (persist = true) => {
    const n = k => { const el = $("#c_" + k); const x = parseFloat(el?.value); return isFinite(x) ? x : 0; };
    const c = {}; Object.keys(C.calcDefaults).forEach(k => c[k] = k === "licence" ? ($("#c_licence").checked ? 1 : 0) : n(k));
    if (persist) { S.calc = c; save(); }
    const reuseN = c.devices * c.reusePct / 100, partsN = c.devices * c.partsPct / 100, recN = Math.max(0, c.devices - reuseN - partsN);
    const revenue = reuseN * c.price + partsN * c.partsValue;
    const direct = reuseN * (c.partsCost + c.price * c.feePct / 100 + c.post) + recN * c.recycleCost;
    const gm = revenue - direct;
    const hours = (reuseN * c.laborReuse + (partsN + recN) * c.laborOther) / 60;
    const fixed = c.insurance + c.storage + (c.licence ? (692 + 47) / 12 : 0);
    const risk = c.incidentPct / 100 * c.incidentCost / 12;
    const net = gm - fixed - risk;
    const perHr = hours ? gm / hours : 0, netHr = hours ? net / hours : 0;
    const tone = netHr >= c.rate ? "ok" : netHr >= c.rate * .5 ? "warn" : "bad";
    const bars = [["Revenue", revenue], ["Direct costs", -direct], ["Fixed", -fixed], ["Risk reserve", -risk], ["Net", net]];
    const max = Math.max(1, ...bars.map(b => Math.abs(b[1])));
    const W = 460, rowH = 30, labelW = 110, scale = (W - labelW - 70) / max;
    const svg = `<svg class="chart" viewBox="0 0 ${W} ${bars.length * rowH + 6}" role="img" aria-label="Monthly money breakdown">${bars.map((b, i) => { const w = Math.max(1, Math.abs(b[1]) * scale); const y = i * rowH + 4; const col = i === 0 ? "var(--mask)" : i === 4 ? (b[1] >= 0 ? "var(--ok)" : "var(--bad)") : "var(--copper)"; return `<text x="0" y="${y + 15}">${b[0]}</text><rect x="${labelW}" y="${y + 3}" width="${w}" height="16" rx="3" fill="${col}" opacity="${i === 0 || i === 4 ? 1 : .75}"/><text x="${labelW + w + 6}" y="${y + 15}">${money(b[1])}</text>`; }).join("")}</svg>`;
    $("#calcOut").innerHTML = `<div class="card raised"><span class="eyebrow">Net per hour of your time</span><div class="out-big ${netHr < 0 ? "neg" : ""}">${money(netHr, 2)}</div>
      <div class="verdict ${tone}">${tone === "ok" ? "Beats your hourly target." : tone === "warn" ? "Below your target. Look at labour minutes and sale prices." : "Well below your target at these numbers."}</div>
      ${svg}
      <div><div class="out-row"><span>Devices resold / parted / recycled</span><b>${reuseN.toFixed(1)} / ${partsN.toFixed(1)} / ${recN.toFixed(1)}</b></div>
      <div class="out-row"><span>Gross margin a month</span><b>${money(gm)}</b></div>
      <div class="out-row"><span>Gross margin per labour hour</span><b>${money(perHr, 2)}</b></div>
      <div class="out-row"><span>Labour hours a month</span><b>${hours.toFixed(1)}</b></div>
      <div class="out-row"><span>Fixed costs a month</span><b>${money(fixed)}</b></div>
      <div class="out-row"><span>Incident reserve a month</span><b>${money(risk)}</b></div>
      <div class="out-row"><span>Net a year</span><b class="${net < 0 ? "neg" : "pos"}">${money(net * 12)}</b></div></div></div>
      <p class="sec-note">Not included: collection travel, returns and refunds, your learning time, tax.</p>`;
  };
  const test = () => {
    const p = +$("#t_price").value || 0, cst = +$("#t_cost").value || 0, m = +$("#t_min").value || 0, rate = (S.calc || C.calcDefaults).rate;
    const hr = m ? (p - cst) / (m / 60) : 0, tone = hr >= rate ? "ok" : hr >= rate * .5 ? "warn" : "bad";
    $("#testOut").innerHTML = `<div class="verdict ${tone}" style="margin-top:12px">${money(p - cst)} margin, ${money(hr, 2)} an hour. ${tone === "ok" ? "Take it." : tone === "warn" ? "Marginal. Can you cut the time?" : "Not worth your time as a whole device. Consider parts or recycling."}</div>`;
  };
  $$("[data-calc]").forEach(i => i.addEventListener("input", () => calc()));
  $("#c_licence").addEventListener("change", () => calc());
  $$("#t_price, #t_cost, #t_min").forEach(i => i.addEventListener("input", test));
  $("#calcReset").addEventListener("click", () => { S.calc = null; save(); viewMoney(); });
  calc(false); test();
}

/* ---------- People ---------- */
function viewPeople() {
  const st = id => (S.contacts[id] || {}).s || 0;
  const doneN = C.contacts.filter(c => st(c.id) === 3).length;
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">People and market</div><h1>Who to ask, and who's already here</h1>
  <p class="lede">Email first, then a scheduled call from your desk. Track each contact's status and notes here. ${doneN} of ${C.contacts.length} answered.</p></div>
  <section class="sec"><div class="sec-head"><h2 class="sec-title">Outreach list</h2><span class="sec-note">${docLink("CALL-SCRIPTS", "Full call scripts →")} · ${docLink("EMAIL-DRAFTS", "Ready-to-send emails →")}</span></div>
  <div class="grid g2">${C.contacts.map(c => { const s = S.contacts[c.id] || {}; return `<article class="card contact st-${s.s || 0}"><div class="contact-top"><div><h3>${esc(c.n)}</h3><p class="muted" style="font-size:13.5px">${esc(c.r)}</p></div>
    <select class="status-sel" data-status="${c.id}" aria-label="Status for ${esc(c.n)}">${C.statuses.map((x, i) => `<option value="${i}" ${(s.s || 0) === i ? "selected" : ""}>${x}</option>`).join("")}</select></div>
    ${c.ph ? `<div class="line"><span>${esc(c.ph)}</span><button class="copy" data-copy="${esc(c.ph)}">Copy</button></div>` : ""}
    ${c.em ? `<div class="line"><span style="overflow-wrap:anywhere">${esc(c.em)}</span><button class="copy" data-copy="${esc(c.em)}">Copy</button></div>` : ""}
    ${c.note ? `<p class="sec-note">${esc(c.note)}</p>` : ""}
    <details><summary class="muted" style="cursor:pointer;font-size:14px">${c.ask.length} questions to ask</summary><ul class="list" style="margin-top:8px;font-size:14px">${c.ask.map(a => `<li>${esc(a)}</li>`).join("")}</ul></details>
    <label class="field" for="note_${c.id}"><span>Notes</span><textarea id="note_${c.id}" data-cnote="${c.id}" rows="2" placeholder="Who you spoke to, what they said, follow-ups">${esc(s.note || "")}</textarea></label>
    ${docLink(c.doc, "Background →")}</article>`; }).join("")}</div></section>

  <section class="sec"><h2 class="sec-title">Dubbo's existing players</h2>
    <div class="grid g3">${C.local.map(g => `<div class="card"><span class="eyebrow">${esc(g[0])}</span>${g[1].map(x => `<div><b>${esc(x[0])}</b><p class="prose-sm muted">${esc(x[1])}</p></div>`).join("")}</div>`).join("")}</div></section>

  <section class="sec"><h2 class="sec-title">Reuse models to learn from</h2>
    <div class="table-wrap"><table class="data"><thead><tr><th>Model</th><th>Takes</th><th>Does</th><th>Result</th></tr></thead><tbody>${C.models.map(m => `<tr><td><b>${esc(m[0])}</b></td><td>${esc(m[1])}</td><td>${esc(m[2])}</td><td>${esc(m[3])}</td></tr>`).join("")}</tbody></table></div>
    <p class="sec-note">${docLink("REUSE-MODELS-PONYUP-RECONNECT-LAPTOP-INITIATIVE", "Reuse models deep dive →")} · ${docLink("SIRCEL-ITAD-REUSE-MODEL", "Sircel →")} · ${docLink("bendigo-early-days-deep-dive", "Bendigo early days →")}</p></section>

  <section class="sec"><h2 class="sec-title">Ways into Dubbo ITAD, easiest first</h2>
    <div class="card"><ol class="rank">${C.pathways.map(p => `<li><span><b>${esc(p[0])}.</b> ${esc(p[1])}</span></li>`).join("")}</ol></div>
    <div class="callout">Strongest risk-adjusted sequence from the research: G1 white-label or Greenbox partner → win Dubbo accounts → prove volume → secure aggregation → local processing → a branded branch only when the numbers justify it.</div></section></div>`;
  $$("[data-status]").forEach(s => s.addEventListener("change", () => { const id = s.dataset.status; S.contacts[id] = {...(S.contacts[id] || {}), s: +s.value}; save(); s.closest(".contact").className = "card contact st-" + s.value; }));
  $$("[data-cnote]").forEach(t => t.addEventListener("input", () => { const id = t.dataset.cnote; S.contacts[id] = {...(S.contacts[id] || {}), note: t.value}; save(); }));
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => copyText(b.dataset.copy, b)));
}

/* ---------- Log ---------- */
function viewLog() {
  const L = S.log;
  const list = (key, ph, label) => `<div class="card"><h3>${label}</h3><ul class="log-list" id="list_${key}">${L[key].length ? L[key].map(x => `<li><input type="checkbox" data-done="${key}:${x.id}" ${x.done ? "checked" : ""} aria-label="Done" style="accent-color:var(--copper);margin-top:4px"><span>${esc(x.text)}</span><button class="x" data-del="${key}:${x.id}" aria-label="Delete">×</button></li>`).join("") : `<li class="empty" style="border:0;background:none">Nothing yet.</li>`}</ul>
    <form class="add-row" data-add="${key}"><input class="box" id="add_${key}" placeholder="${esc(ph)}" aria-label="${esc(label)}"><button class="btn small">Add</button></form></div>`;
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Learning log</div><h1>One notes file for everything</h1>
  <p class="lede">A glossary, open questions and a "what I'd get wrong" list, so you can see what's sinking in. Everything here is private to you.</p></div>
  <div class="row"><button class="btn" id="exportLog">Save the log as a Markdown file</button><span class="sec-note" id="exportNote"></span></div>
  <div class="card raised"><h3>Parking lot</h3><p class="sec-note">When the phone rings, jot where you were.</p><textarea class="box" id="parking" rows="4" placeholder="Was halfway through the EPA thresholds table, row for resource recovery outside the regulated area…">${esc(L.parking)}</textarea></div>
  <div class="grid g2">${list("questions", "A question to answer", "Open questions")}${list("wrong", "Something you'd likely get wrong", "What I'd get wrong")}</div>
  <div class="card"><h3>Source notes</h3><p class="sec-note">Three lines per source: what it requires, who it applies to, what you're unsure of.</p>
    <form class="grid g3" id="noteForm"><label class="field" for="n_src"><span>Source</span><input id="n_src" placeholder="EPA Guide to Licensing"></label><label class="field" for="n_req"><span>Requires</span><input id="n_req"></label><label class="field" for="n_who"><span>Applies to</span><input id="n_who"></label><label class="field" for="n_uns"><span>Unsure of</span><input id="n_uns"></label><div class="row" style="align-items:end"><button class="btn small">Add note</button></div></form>
    ${L.notes.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Source</th><th>Requires</th><th>Applies to</th><th>Unsure of</th><th></th></tr></thead><tbody>${L.notes.map(n => `<tr><td><b>${esc(n.src)}</b></td><td>${esc(n.req)}</td><td>${esc(n.who)}</td><td>${esc(n.uns)}</td><td><button class="x copy" data-del="notes:${n.id}" aria-label="Delete">×</button></td></tr>`).join("")}</tbody></table></div>` : ""}</div>
  <div class="card"><h3>My glossary</h3><p class="sec-note">Terms you add here join the flashcard deck.</p>
    <form class="grid g3" id="glossForm"><label class="field" for="g_term"><span>Term</span><input id="g_term"></label><label class="field" for="g_def" style="grid-column:span 1"><span>Meaning, in your words</span><input id="g_def"></label><div class="row" style="align-items:end"><button class="btn small">Add term</button></div></form>
    ${L.glossary.length ? `<ul class="log-list">${L.glossary.map(g => `<li><span><b>${esc(g.term)}</b>: ${esc(g.def)}</span><button class="x" data-del="glossary:${g.id}" aria-label="Delete">×</button></li>`).join("")}</ul>` : ""}</div>
  <div class="card"><h3>Recall notes</h3><p class="sec-note">Written from memory after reading. Compare them over time.</p>
    ${L.recalls.length ? L.recalls.slice().reverse().map(r => `<div style="border-top:1px solid var(--line);padding-top:10px"><div class="row"><b>${esc(BY_ID[r.doc]?.title || r.doc)}</b><span class="mono muted" style="font-size:12px">${esc(r.date)}</span><span class="spacer"></span><button class="x copy" data-del="recalls:${r.id}" aria-label="Delete">×</button></div><p class="recall">${esc(r.text)}</p></div>`).join("") : `<p class="empty">Use "Recall check" on any doc, or the Recall tab in Practice.</p>`}</div></div>`;
  let pt; $("#parking").addEventListener("input", e => { L.parking = e.target.value; clearTimeout(pt); pt = setTimeout(save, 400); });
  $$("[data-add]").forEach(f => f.addEventListener("submit", e => { e.preventDefault(); const k = f.dataset.add, inp = $("#add_" + k); const t = inp.value.trim(); if (!t) return; L[k].push({id: uid(), text: t, done: false}); save(); viewLog(); $("#add_" + k)?.focus(); }));
  $$("[data-done]").forEach(c => c.addEventListener("change", () => { const [k, id] = c.dataset.done.split(":"); const it = L[k].find(x => x.id === id); if (it) { it.done = c.checked; save(); } }));
  $$("[data-del]").forEach(b => b.addEventListener("click", () => { const [k, id] = b.dataset.del.split(":"); L[k] = L[k].filter(x => x.id !== id); save(); viewLog(); }));
  $("#noteForm").addEventListener("submit", e => { e.preventDefault(); const v = id => $("#" + id).value.trim(); if (!v("n_src")) return; L.notes.push({id: uid(), src: v("n_src"), req: v("n_req"), who: v("n_who"), uns: v("n_uns")}); save(); viewLog(); });
  $("#glossForm").addEventListener("submit", e => { e.preventDefault(); const t = $("#g_term").value.trim(), d = $("#g_def").value.trim(); if (!t || !d) return; L.glossary.push({id: uid(), term: t, def: d}); save(); viewLog(); });
  getDownloads().then(dl => {
    const btn = $("#exportLog"); if (!btn) return;
    if (!dl && window.claude) { btn.hidden = true; return; }
    btn.addEventListener("click", async () => {
      const md = ["# Dubbo E-Waste learning log", `Exported ${today()}`, "", "## Parking lot", L.parking || "_empty_", "", "## Open questions", ...L.questions.map(q => `- [${q.done ? "x" : " "}] ${q.text}`), "", "## What I'd get wrong", ...L.wrong.map(q => `- [${q.done ? "x" : " "}] ${q.text}`), "", "## Source notes", ...L.notes.map(n => `### ${n.src}\n- Requires: ${n.req}\n- Applies to: ${n.who}\n- Unsure of: ${n.uns}`), "", "## My glossary", ...L.glossary.map(g => `- **${g.term}**: ${g.def}`), "", "## Recall notes", ...L.recalls.map(r => `### ${BY_ID[r.doc]?.title || r.doc} (${r.date})\n${r.text}`)].join("\n");
      const filename = `dubbo-ewaste-learning-log-${today()}.md`;
      if (!dl) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([md], {type: "text/markdown"})); a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); return; }
      try { await dl.save({filename, data: md}); $("#exportNote").textContent = ""; }
      catch (e) { $("#exportNote").textContent = e && e.code === "cancelled" ? "Save cancelled." : "Couldn't save the file here."; }
    });
  });
}

/* ---------- Library ---------- */
let libFilter = "all";
function viewLibrary() {
  const readN = Object.keys(S.read).filter(k => BY_ID[k]).length;
  const groups = DATA.meta.groups.filter(g => DOCS.some(d => d.group === g.id));
  main.innerHTML = `<div class="page">
  <div class="page-head"><div class="eyebrow">Research library</div><h1>Every document in the repo</h1>
  <p class="lede">${DOCS.length} documents, about ${Math.round(DOCS.reduce((a, d) => a + d.words, 0) / 1000)}k words, grouped by topic. You've read ${readN}. Each doc has a recall check, and can ask Claude to quiz you on it.</p></div>
  <div class="lib-tools"><input class="box" id="libSearch" type="search" placeholder="Filter by title or search inside docs" value="${esc(lastQuery)}" aria-label="Filter documents">
    <select class="status-sel" id="libGroup" aria-label="Topic"><option value="all">All topics</option>${groups.map(g => `<option value="${g.id}" ${libFilter === g.id ? "selected" : ""}>${esc(g.label)}</option>`).join("")}</select></div>
  <div id="libBody"></div></div>`;
  const render = () => {
    const q = $("#libSearch").value.trim().toLowerCase();
    const body = $("#libBody");
    if (q.length > 2) { body.innerHTML = searchHtml(q); return; }
    body.innerHTML = groups.filter(g => libFilter === "all" || libFilter === g.id).map(g => {
      const ds = DOCS.filter(d => d.group === g.id && (!q || d.title.toLowerCase().includes(q) || d.path.toLowerCase().includes(q)));
      if (!ds.length) return "";
      return `<section class="lib-group" style="margin-top:22px"><div class="sec-head"><h2 class="sec-title">${esc(g.label)}</h2><span class="sec-note">${ds.filter(d => S.read[d.id]).length}/${ds.length} read</span></div><div class="doc-list">${ds.map(docCard).join("")}</div></section>`;
    }).join("");
  };
  $("#libSearch").addEventListener("input", () => { lastQuery = $("#libSearch").value; render(); });
  $("#libGroup").addEventListener("change", e => { libFilter = e.target.value; render(); });
  render();
}
function docCard(d) {
  return `<a class="doc-card${S.read[d.id] ? " read" : ""}" href="#doc-${esc(d.id)}"><b>${esc(d.title)}</b><small>${esc(d.path)}</small><span class="meta">${S.read[d.id] ? `<span class="chip ok">Read</span>` : ""}<span class="chip">${d.path.endsWith(".csv") ? "Tracker" : readMins(d) + " min"}</span>${d.local ? `<span class="chip warn">Not on GitHub yet</span>` : ""}${d.path.startsWith("agyDOCS/") && !d.path.includes("CORRECTIONS") ? `<span class="chip warn">See caveats</span>` : ""}</span></a>`;
}
function searchHtml(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = DOCS.map(d => {
    const low = d.text.toLowerCase();
    let score = 0; terms.forEach(t => { let i = -1, n = 0; while ((i = low.indexOf(t, i + 1)) !== -1 && n < 50) n++; score += n + (d.title.toLowerCase().includes(t) ? 20 : 0); });
    if (!terms.every(t => low.includes(t) || d.title.toLowerCase().includes(t))) score = 0;
    return {d, score, low};
  }).filter(h => h.score).sort((a, b) => b.score - a.score).slice(0, 40);
  if (!hits.length) return `<p class="empty">No documents mention "${esc(q)}".</p>`;
  const re = new RegExp("(" + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  return `<p class="sec-note" style="margin-top:14px">${hits.length} document${hits.length > 1 ? "s" : ""} mention "${esc(q)}".</p>` + hits.map(({d, low}) => {
    const i = low.indexOf(terms[0]); const s = Math.max(0, i - 90);
    const snip = d.text.slice(s, s + 240).replace(/[#*_`>|]/g, " ").replace(/\s+/g, " ").trim();
    return `<a class="hit" href="#doc-${esc(d.id)}"><b>${esc(d.title)}</b><p>${s > 0 ? "…" : ""}${esc(snip).replace(re, "<mark>$1</mark>")}…</p><small class="mono muted">${esc(GROUP_LABEL[d.group])} · ${esc(d.path)}</small></a>`;
  }).join("");
}
function viewSearch(raw) {
  const q = lastQuery || raw.replace(/_/g, " ");
  lastQuery = q;
  viewLibrary();
}

/* ---------- Doc reader ---------- */
function slug(s) { return s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "s"; }
function renderMarkdown(d) {
  if (d.path.endsWith(".csv")) {
    const lines = d.text.trim().split(/\r?\n/);
    const head = lines[0].split(",");
    return `<p>This tracker has ${head.length} fields${lines.length > 1 ? ` and ${lines.length - 1} rows` : ""}. Copy the header row into a spreadsheet to start logging.</p><div class="csv-fields">${head.map(h => `<code>${esc(h)}</code>`).join("")}</div>${lines.length > 1 ? `<div class="tw"><table><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${lines.slice(1).map(l => `<tr>${l.split(",").map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}<p><button class="btn small" data-copy="${esc(lines[0])}">Copy header row</button></p>`;
  }
  const html = window.marked ? marked.parse(d.text, {gfm: true}) : `<pre>${esc(d.text)}</pre>`;
  return window.DOMPurify ? DOMPurify.sanitize(html, {ADD_ATTR: ["target"]}) : html;
}
async function viewDoc(id) {
  const d = BY_ID[id];
  if (!d) { main.innerHTML = `<div class="page"><p class="empty">That document isn't in this build. <a href="#library">Back to the library</a>.</p></div>`; return; }
  const sib = DOCS.filter(x => x.group === d.group), pos = sib.indexOf(d);
  const prev = sib[pos - 1], next = sib[pos + 1];
  const ghUrl = `${DATA.meta.repo}/blob/main/${d.path.split("/").map(encodeURIComponent).join("/")}`;
  main.innerHTML = `<div class="page"><div class="reader"><div class="reader-main">
    <div class="reader-head"><div class="row"><a class="eyebrow" href="#library" style="text-decoration:none">← ${esc(GROUP_LABEL[d.group])}</a></div><h1>${esc(d.title)}</h1>
      <div class="row"><span class="mono muted" style="font-size:12.5px">${esc(d.path)}</span><span class="chip">${d.path.endsWith(".csv") ? "Tracker" : readMins(d) + " min read"}</span>${d.local ? `<span class="chip warn">Local only, not on GitHub yet</span>` : `<a href="${esc(ghUrl)}" target="_blank" rel="noopener" style="font-size:13px">View on GitHub ↗</a>`}</div>
      <div class="doc-actions"><button class="btn small ${S.read[id] ? "" : "primary"}" id="markRead">${S.read[id] ? "Read ✓ (mark unread)" : "Mark as read"}</button><button class="btn small" id="recallBtn">Recall check</button><button class="btn small" id="quizBtn" hidden>Quiz me on this (Claude)</button><button class="btn small" id="askBtn" hidden>Ask about this doc</button></div></div>
    ${d.path.startsWith("agyDOCS/") && !d.path.includes("CORRECTIONS") ? `<div class="callout warn">This guide describes generic industry practice and contains claims later corrected. Read ${docLink("agyDOCS~00-CORRECTIONS-AND-CAVEATS", "the corrections and caveats")} first.</div>` : ""}
    <div class="panel" id="toolPanel" hidden></div>
    <article class="prose" id="prose">${renderMarkdown(d)}</article>
    <div class="pager">${prev ? `<a href="#doc-${esc(prev.id)}"><small>← Previous</small>${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a class="next" href="#doc-${esc(next.id)}"><small>Next →</small>${esc(next.title)}</a>` : ""}</div>
  </div><nav class="toc" id="toc" aria-label="On this page"></nav></div></div>`;
  const prose = $("#prose"), dir = d.path.includes("/") ? d.path.slice(0, d.path.lastIndexOf("/") + 1) : "";
  $$("table", prose).forEach(t => { const w = document.createElement("div"); w.className = "tw"; t.replaceWith(w); w.appendChild(t); });
  const used = {};
  const heads = $$("h2, h3", prose).map(h => { let s = slug(h.textContent); used[s] = (used[s] || 0) + 1; if (used[s] > 1) s += "-" + used[s]; h.id = "sec-" + s; return h; });
  $("#toc").innerHTML = heads.length > 2 ? `<span class="eyebrow" style="margin-bottom:6px">On this page</span>` + heads.map(h => `<a class="${h.tagName.toLowerCase()}" href="#" data-target="${h.id}">${esc(h.textContent)}</a>`).join("") : "";
  $$("#toc a").forEach(a => a.addEventListener("click", e => { e.preventDefault(); document.getElementById(a.dataset.target)?.scrollIntoView({behavior: "smooth", block: "start"}); }));
  $$("a", prose).forEach(a => {
    const href = a.getAttribute("href") || "";
    if (/^https?:/i.test(href)) { a.target = "_blank"; a.rel = "noopener"; return; }
    if (href.startsWith("#")) { const t = slug(decodeURIComponent(href.slice(1))); a.addEventListener("click", e => { e.preventDefault(); (document.getElementById("sec-" + t) || heads.find(h => h.id.startsWith("sec-" + t)))?.scrollIntoView({behavior: "smooth"}); }); return; }
    const [p] = href.split("#");
    const parts = (dir + p).split("/"), out = [];
    parts.forEach(seg => { if (seg === "..") out.pop(); else if (seg && seg !== ".") out.push(seg); });
    const target = BY_PATH[out.join("/")];
    if (target) a.setAttribute("href", "#doc-" + target.id);
    else if (p) { a.setAttribute("href", `${DATA.meta.repo}/blob/main/${out.join("/")}`); a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-copy]", prose).forEach(b => b.addEventListener("click", () => copyText(b.dataset.copy, b)));
  $("#markRead").addEventListener("click", () => { if (S.read[id]) delete S.read[id]; else S.read[id] = today(); save(); viewDoc(id); });
  const panel = $("#toolPanel");
  $("#recallBtn").addEventListener("click", () => {
    panel.hidden = false;
    panel.innerHTML = `<h3 style="font-size:16px">Recall check</h3><p class="sec-note">Scroll away or look away. Write what you remember from this doc so far, then compare against the headings.</p><textarea class="box" id="rc" rows="5" aria-label="What you remember"></textarea><div class="row"><button class="btn primary small" id="rcSave">Save to learning log</button><button class="btn ghost small" id="rcClose">Close</button></div>`;
    $("#rc").focus();
    $("#rcSave").addEventListener("click", () => { const t = $("#rc").value.trim(); if (!t) return; S.log.recalls.push({id: uid(), doc: id, text: t, date: today()}); save(); toast("Saved to your learning log"); panel.hidden = true; });
    $("#rcClose").addEventListener("click", () => panel.hidden = true);
  });
  const sample = await getSample();
  if (!sample || BY_ID[location.hash.slice(5)] !== d) return;
  const qb = $("#quizBtn"), ab = $("#askBtn");
  qb.hidden = false; ab.hidden = false;
  const docText = d.text.slice(0, 120000);
  qb.addEventListener("click", async () => {
    panel.hidden = false;
    panel.innerHTML = `<h3 style="font-size:16px">Quiz from this doc</h3><p class="muted" id="qStatus">Asking Claude for five questions. This can take up to a minute.</p><div id="qList"></div>`;
    try {
      const res = await sample.json(`You are helping someone study a research document about starting a small e-waste reuse and refurbishment business in Dubbo, NSW, Australia. Write 5 short-answer retrieval-practice questions that test the most decision-relevant facts in the document (numbers, rules, who does what, what is unconfirmed). Use only facts stated in the document. Return JSON only: {"questions":[{"q":"question","a":"answer in one or two sentences"}]}.\n\nDOCUMENT (${d.path}):\n${docText}`, {modelTier: "default"});
      const qs = (res && res.questions) || [];
      $("#qStatus").textContent = qs.length ? "Answer each in your head or on paper, then reveal." : "Claude didn't return questions. Try again.";
      $("#qList").innerHTML = qs.map((x, i) => `<details class="acc"><summary>${i + 1}. ${esc(x.q)}</summary><div class="acc-body"><p>${esc(x.a)}</p></div></details>`).join("");
    } catch (e) {
      if (e && e.code === "not_granted") { qb.hidden = true; ab.hidden = true; panel.hidden = true; return; }
      $("#qStatus").textContent = e && e.code === "rate_limited" ? "Too many requests just now. Try again in a minute." : "Couldn't get questions this time.";
    }
  });
  ab.addEventListener("click", () => {
    panel.hidden = false;
    panel.innerHTML = `<h3 style="font-size:16px">Ask about this doc</h3><form class="add-row" id="askForm"><input class="box" id="askQ" placeholder="e.g. What would make AMR's downstream route proven?" aria-label="Your question"><button class="btn primary small">Ask</button></form><div class="ai-out" id="askOut"></div>`;
    $("#askQ").focus();
    let ctl = null;
    $("#askForm").addEventListener("submit", async e => {
      e.preventDefault();
      const q = $("#askQ").value.trim(); if (!q) return;
      ctl?.abort(); ctl = new AbortController();
      const out = $("#askOut"); out.textContent = "Thinking…";
      try {
        const r = await sample(`Answer the question using only the document below, which is research for a small e-waste reuse business in Dubbo, NSW. Be brief and plain. If the document doesn't answer it, say so and say what to check.\n\nQUESTION: ${q}\n\nDOCUMENT (${d.path}):\n${docText}`, {modelTier: "default", signal: ctl.signal, onText: ({text}) => { out.textContent = text; }});
        out.textContent = r.text + (r.truncated ? "\n\n(Answer was cut short.)" : "");
      } catch (err) {
        if (err && err.code === "not_granted") { qb.hidden = true; ab.hidden = true; panel.hidden = true; return; }
        if (err && err.code !== "cancelled") out.textContent = (err.text ? err.text + "\n\n" : "") + (err.code === "rate_limited" ? "Too many requests just now. Try again shortly." : "Couldn't get an answer this time.");
      }
    });
  });
}

/* ---------- global checkbox handling ---------- */
document.addEventListener("change", e => {
  const k = e.target.dataset?.check; if (!k) return;
  if (e.target.checked) S.checks[k] = 1; else delete S.checks[k];
  save();
  const lab = e.target.closest(".check, .gate"); if (lab) lab.classList.toggle("done", e.target.checked);
  if (location.hash === "#plan") { const y = scrollY; const open = $$("details.week").map(x => x.open); viewPlan(); $$("details.week").forEach((x, i) => x.open = open[i]); scrollTo(0, y); }
});

renderSync();
route();
initCloud();
})();
