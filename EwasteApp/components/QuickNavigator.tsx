"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GO_SHORTCUTS, visibleHelpSections, type HelpLink } from "@/lib/help-navigation";
import type { ProgrammeContext } from "@/lib/programmes";
import styles from "./QuickNavigator.module.css";

type Props = {
  programme: ProgrammeContext["selected"];
  globalAdmin: boolean;
  role: string;
};
type Mode = "navigate" | "shortcuts";

function isEditing(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']"));
}

export function QuickNavigator({ programme, globalAdmin, role }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sections = useMemo(() => visibleHelpSections({ selected: programme, global_admin: globalAdmin, role }), [programme, globalAdmin, role]);
  const links = useMemo(() => sections.flatMap(section => section.links), [sections]);
  const available = useMemo(() => new Set(links.map(link => link.href)), [links]);
  const goKeys = useMemo(() => GO_SHORTCUTS.filter(item => available.has(item.href)), [available]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("navigate");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [waitingForGo, setWaitingForGo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const goStarted = useRef(0);

  const matches = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const results = links.filter(item => {
      const haystack = `${item.label} ${item.description} ${item.keywords || ""} ${item.href}`.toLowerCase();
      return words.every(word => haystack.includes(word));
    });
    return results.slice(0, 45);
  }, [links, query]);

  function show(nextMode: Mode) {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMode(nextMode);
    setQuery("");
    setSelected(0);
    setOpen(true);
    setWaitingForGo(false);
    goStarted.current = 0;
  }
  function hide() {
    setOpen(false);
    setWaitingForGo(false);
    goStarted.current = 0;
    previousFocus.current?.focus();
  }
  function visit(href: string) {
    if (!available.has(href)) return;
    setOpen(false);
    setWaitingForGo(false);
    goStarted.current = 0;
    router.push(href);
  }

  useEffect(() => {
    if (open) {
      if (mode === "navigate") inputRef.current?.focus();
      else dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }
  }, [open, mode]);

  useEffect(() => { setOpen(false); setWaitingForGo(false); goStarted.current = 0; }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && !event.altKey && key === "k") {
        event.preventDefault();
        if (open) hide(); else show("navigate");
        return;
      }
      if (open) {
        if (event.key === "Escape") { event.preventDefault(); hide(); }
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || isEditing(event.target)) {
        goStarted.current = 0;
        setWaitingForGo(false);
        return;
      }
      if (event.key === "?") { event.preventDefault(); show("shortcuts"); return; }
      if (event.key === "/" && available.has("/search")) { event.preventDefault(); visit("/search"); return; }
      const now = Date.now();
      if (goStarted.current && now - goStarted.current < 1400) {
        goStarted.current = 0;
        setWaitingForGo(false);
        const hit = goKeys.find(item => item.key === key);
        if (hit) { event.preventDefault(); visit(hit.href); }
        return;
      }
      if (key === "g") {
        goStarted.current = now;
        setWaitingForGo(true);
        event.preventDefault();
      } else {
        goStarted.current = 0;
        setWaitingForGo(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // Deliberately use the current accessible destination set and modal state.
  }, [open, pathname, goKeys, available]);

  useEffect(() => {
    if (!waitingForGo) return;
    const timeout = window.setTimeout(() => { goStarted.current = 0; setWaitingForGo(false); }, 1500);
    return () => window.clearTimeout(timeout);
  }, [waitingForGo]);

  function onSearchKeys(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setSelected(i => Math.min(matches.length - 1, i + 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setSelected(i => Math.max(0, i - 1)); }
    if (event.key === "Enter" && matches.length) { event.preventDefault(); visit(matches[Math.max(0, selected)].href); }
  }
  function trapTab(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const tabbables = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]") || []);
    if (!tabbables.length) return;
    const first = tabbables[0], last = tabbables[tabbables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return <>
    <button type="button" className={styles.trigger} aria-haspopup="dialog" aria-expanded={open} aria-keyshortcuts="Control+K Meta+K" onClick={() => open ? hide() : show("navigate")}>
      <span>Find a page</span> <kbd>Ctrl/⌘ K</kbd>
    </button>
    {waitingForGo && !open ? <div role="status" className={styles.sequenceHint}>G then… {goKeys.map(item => item.key.toUpperCase()).join(" · ")}</div> : null}
    {open ? <div className={styles.backdrop} onPointerDown={event => { if (event.target === event.currentTarget) hide(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="assetflow-navigation-title" className={styles.dialog} onKeyDown={trapTab}>
        <div className={styles.dialogHeader}>
          <h2 id="assetflow-navigation-title">{mode === "navigate" ? "Jump to anywhere in AssetFlow" : "Keyboard shortcuts"}</h2>
          <button className={styles.close} type="button" onClick={hide} aria-label="Close quick navigation">✕ <kbd>Esc</kbd></button>
        </div>
        <div className={styles.tabs} role="group" aria-label="Quick navigator sections">
          <button type="button" aria-pressed={mode === "navigate"} onClick={() => { setMode("navigate"); setSelected(0); }}>Find a page</button>
          <button type="button" aria-pressed={mode === "shortcuts"} onClick={() => setMode("shortcuts")}>Shortcuts</button>
        </div>
        {mode === "navigate" ? <>
          <label htmlFor="assetflow-quick-search" className={styles.srOnly}>Search pages and features</label>
          <input id="assetflow-quick-search" ref={inputRef} type="search" value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={onSearchKeys} className={styles.search} placeholder="Search features, e.g. donor, scan, invoice, Repair Café…" autoComplete="off" />
          <div className={styles.results} aria-label="Available pages">
            {matches.map((item: HelpLink, index: number) => <button type="button" key={item.href} className={index === selected ? styles.resultSelected : styles.result} onMouseEnter={() => setSelected(index)} onClick={() => visit(item.href)}>
              <span><strong>{item.label}</strong><small>{item.description}</small></span><span className={styles.route}>{item.href}</span>
            </button>)}
            {!matches.length ? <p className={styles.empty}>No matching pages you can access. Try “asset”, “repair”, “report” or “help”.</p> : null}
          </div>
          <p className={styles.hint}>↑ ↓ choose · Enter open · Esc close · Only your accessible programme pages appear</p>
        </> : <div className={styles.shortcutBody}>
          <p>Shortcuts work throughout the signed-in app, except while typing in a form or editor. They do not save or change records.</p>
          <div className={styles.shortcutRow}><span>Find any page</span><kbd>Ctrl/⌘ K</kbd></div>
          <div className={styles.shortcutRow}><span>Show this shortcut guide</span><kbd>?</kbd></div>
          {available.has("/search") ? <div className={styles.shortcutRow}><span>Search or scan</span><kbd>/</kbd></div> : null}
          {goKeys.map(item => <div key={item.href} className={styles.shortcutRow}><span>{item.label}</span><kbd>G</kbd><kbd>{item.key.toUpperCase()}</kbd></div>)}
          <div className={styles.shortcutRow}><span>Close this window</span><kbd>Esc</kbd></div>
          <p className={styles.hint}>Press G, release it, then press the second key within a moment. Keyboard access always respects your programme permissions.</p>
        </div>}
        <div className={styles.dialogFooter}><button type="button" className={styles.footerLink} onClick={() => visit("/help")}>Open the full user guide →</button></div>
      </div>
    </div> : null}
  </>;
}
