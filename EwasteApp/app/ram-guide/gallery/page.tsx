"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { awaitingPhotos, commonsFilePage, commonsThumb, ramPhotos, specialistReferences, type RAMPhoto } from "@/lib/ram-gallery";
import styles from "./gallery.module.css";

const eras = ["All","Pre-SDR","SDR","DDR","DDR2","DDR3","DDR4","DDR5","Rambus","LPDDR","GDDR","HBM"];
const sources = [
  {label:"RAM modules archive",href:"https://commons.wikimedia.org/wiki/Category:RAM_modules"},
  {label:"Desktop DIMMs by generation",href:"https://commons.wikimedia.org/wiki/Category:RAM_DIMMs_by_memory_type"},
  {label:"Laptop SO-DIMMs by generation",href:"https://commons.wikimedia.org/wiki/Category:RAM_SO-DIMMs_by_memory_type"},
  {label:"Server & historic module families",href:"https://commons.wikimedia.org/wiki/Category:FB-DIMM"},
  {label:"Flat CAMM2 modules",href:"https://commons.wikimedia.org/wiki/Category:CAMM2_RAM"},
  {label:"Kingston modern module guide",href:"https://www.kingston.com/en/blog/system-builder/understanding-memory-modules-cudimm-csodimm-camm2-mrdimm-video"}
];
function Photo({entry,large=false}:{entry:RAMPhoto;large?:boolean}) {
  const [failed,setFailed] = useState(false);
  return <div className={large?styles.largePhoto:styles.photo}>
    {failed ? <div className={styles.missing}><span aria-hidden="true">▣</span><strong>Image unavailable</strong><small>View the original Wikimedia Commons file below</small></div>
      : /* Direct external image deliberately unoptimised; Commons handles the thumbnail. */
      // eslint-disable-next-line @next/next/no-img-element
      <img src={commonsThumb(entry.file)} loading={large?"eager":"lazy"} onError={()=>setFailed(true)} alt={"Real photograph: "+entry.title} />}
    <span className={styles.photoKind}>REAL PHOTO · WIKIMEDIA COMMONS</span>
  </div>;
}
function Detail({item,onClose,onCompare,compared}:{item:RAMPhoto;onClose:()=>void;onCompare:(id:string)=>void;compared:boolean}) {
  return <div className={styles.modalCover} role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-label={"Details for "+item.title}>
      <div className={styles.dialogHeader}><span className={styles.eyebrow}>PHOTOGRAPHIC REFERENCE / {item.id}</span><button type="button" onClick={onClose} aria-label="Close photo details">✕ Close</button></div>
      <div className={styles.detailLayout}>
        <Photo key={item.id} entry={item} large />
        <div className={styles.detailText}>
          <span className={styles.eyebrow}>{item.generation} / {item.shape}</span>
          <h2>{item.title}</h2>
          <div className={styles.detailSpecs}><div><small>Contacts / connection</small><strong>{item.pins}</strong></div><div><small>Typical use</small><strong>{item.usage}</strong></div><div><small>Availability</small><strong>{item.rarity}</strong></div></div>
          <h3>How to recognise it</h3><p>{item.identify}</p>
          <div className={styles.caution}><strong>Do not match by appearance alone.</strong> Check the actual part number, electrical generation, voltage, pin location, buffering, ECC, motherboard and CPU support.</div>
          <a className={styles.primaryLink} href={commonsFilePage(item.file)} target="_blank" rel="noopener noreferrer">See the original photo, photographer and licence ↗</a>
          <button className={styles.compareButton} onClick={()=>onCompare(item.id)}>{compared?"✓ Remove from comparison":"+ Add to comparison"}</button>
          <p className={styles.credit}>Image file: {item.file}. Attribution and permitted reuse terms are on its linked Commons file page; file licences vary. This site links to, rather than republishes, original source files.</p>
        </div>
      </div>
    </section>
  </div>;
}
export default function Gallery() {
  const [query,setQuery]=useState("");
  const [era,setEra]=useState("All");
  const [shape,setShape]=useState("All");
  const [usage,setUsage]=useState("All");
  const [rarity,setRarity]=useState("All");
  const [visibleCount,setVisibleCount]=useState(24);
  const [active,setActive]=useState<RAMPhoto|null>(null);
  const [compare,setCompare]=useState<string[]>([]);
  const [showMissing,setShowMissing]=useState(false);
  const shapes = useMemo(()=>["All",...Array.from(new Set(ramPhotos.map(x=>x.shape))).sort()],[]);
  const usages = useMemo(()=>["All",...Array.from(new Set(ramPhotos.map(x=>x.usage))).sort()],[]);
  const matches = useMemo(()=>ramPhotos.filter(x=>{
    const needle = (x.title+" "+x.generation+" "+x.shape+" "+x.pins+" "+x.identify+" "+x.file+" "+x.usage).toLowerCase();
    return needle.includes(query.toLowerCase().trim()) && (era==="All" || x.generation===era) &&
      (shape==="All" || x.shape===shape) && (usage==="All"||x.usage===usage) && (rarity==="All"||x.rarity===rarity);
  }),[query,era,shape,usage,rarity]);
  const selected = ramPhotos.filter(x=>compare.includes(x.id));
  const changeFilters = (cb:()=>void)=>{cb();setVisibleCount(24)};
  const reset=()=>{setQuery("");setEra("All");setShape("All");setUsage("All");setRarity("All");setVisibleCount(24)};
  const onCompare=(id:string)=>setCompare(ids=>ids.includes(id)?ids.filter(x=>x!==id):ids.length<3?[...ids,id]:[...ids.slice(1),id]);
  return <><main className={styles.page}>
    <div className={styles.wrap}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/ram-guide">← RAM Explorer</Link><span>/</span><span>Photo gallery</span><Link href="/learn">Learning Hub ↗</Link></nav>
      <header className={styles.hero}><div className={styles.eyebrow}>FIELD SCHOOL / PHOTOGRAPHIC ATLAS</div><h1>THE RAM<br/><em>PHOTO ARCHIVE.</em></h1><p>See what real computer memory looks like: early SIMMs and SDRAM, DDR1–DDR5, server modules, Rambus, tiny laptop formats and chips on graphics cards.</p><div className={styles.heroStats}><span><strong>{ramPhotos.length}</strong> sourced photographs</span><span><strong>{new Set(ramPhotos.map(x=>x.generation)).size}</strong> technology groups</span><span><strong>{awaitingPhotos.length}</strong> variants needing a better photo</span></div><div className={styles.introHint}>Photographs are real, not generated illustrations. Each card has its original file page for author and licensing details. Rare specialist references link to exact manufacturer pages, not empty searches.</div></header>
      <section className={styles.filters} aria-label="Gallery filters">
        <div className={styles.filterHeading}><div><span className={styles.eyebrow}>BROWSE THE COLLECTION</span><h2>Find a RAM type.</h2></div><button onClick={reset}>Reset filters ↺</button></div>
        <label className={styles.searchLabel}>Search a module, feature, pin count or manufacturer
          <input type="search" placeholder="Try DDR2 SO-DIMM, ECC, Rambus, 240 pins…" value={query} onChange={e=>changeFilters(()=>setQuery(e.target.value))} />
        </label>
        <div className={styles.eraStrip} aria-label="Choose RAM generation">
          {eras.map(x=><button key={x} className={era===x?styles.eraActive:styles.eraButton} onClick={()=>changeFilters(()=>{setEra(x);setShape("All")})}>{x}</button>)}
        </div>
        <div className={styles.selectors}><label>Physical format<select value={shape} onChange={e=>changeFilters(()=>setShape(e.target.value))}>{shapes.map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Use case<select value={usage} onChange={e=>changeFilters(()=>setUsage(e.target.value))}>{usages.map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Rarity<select value={rarity} onChange={e=>changeFilters(()=>setRarity(e.target.value))}>{["All","Common","Uncommon","Rare"].map(x=><option key={x}>{x}</option>)}</select></label>
        </div>
      </section>
      <section className={styles.results} aria-label="Real RAM photographs"><div className={styles.resultTop}><h2>{matches.length} matching photos</h2><p>Tap a photo for identification tips, larger view, source and licence.</p></div>
        {matches.length===0?<div className={styles.empty}><h3>Nothing matches those filters.</h3><p>Try another generation or clear the search.</p><button onClick={reset}>Show all photographs</button></div>:
          <div className={styles.gallery}>{matches.slice(0,visibleCount).map(item=><article className={styles.card} key={item.id}>
            <button type="button" className={styles.photoTap} onClick={()=>setActive(item)} aria-label={"View "+item.title}><Photo key={item.file} entry={item}/></button>
            <div className={styles.cardBody}><div className={styles.tags}><span>{item.generation}</span><span>{item.shape}</span></div><h3>{item.title}</h3><p className={styles.pin}>{item.pins} · {item.usage}</p><p className={styles.identify}>{item.identify}</p><div className={styles.cardFooter}><button onClick={()=>setActive(item)}>View details ↗</button><button aria-label={(compare.includes(item.id)?"Remove":"Add")+" "+item.title+" to comparison"} className={compare.includes(item.id)?styles.compareActive:styles.add} onClick={()=>onCompare(item.id)}>{compare.includes(item.id)?"✓ Selected":"+ Compare"}</button></div></div>
            <a href={commonsFilePage(item.file)} target="_blank" rel="noopener noreferrer" className={styles.source}>Photographer, original & licence ↗</a>
          </article>)}</div>}
        {visibleCount<matches.length && <button className={styles.showMore} onClick={()=>setVisibleCount(n=>n+24)}>Load 24 more photographs ({matches.length-visibleCount} remaining) ↓</button>}
      </section>
      <section className={styles.gaps} id="rare-formats">
        <div className={styles.filterHeading}><div><span className={styles.eyebrow}>SPECIALIST PHOTOGRAPHS / VERIFIED LINKS</span><h2>Rare RAM, real sources</h2></div></div>
        <p>These are specific manufacturer photograph pages, an actual seller listing, and one original engineering drawing. Unlike the old research queue, <strong>none of these links runs a search</strong>. Some photographs cannot legally or reliably be mirrored into the gallery, so open the source to view them.</p>
        <div className={styles.missingGrid}>{specialistReferences.map(ref=><article key={ref.url}>
          <span>{ref.generation} · {ref.shape}</span><h3>{ref.title}</h3>
          <p className={styles.referenceType}>{ref.type}</p><p>{ref.note}</p>
          <a href={ref.url} target="_blank" rel="noopener noreferrer">Open the exact photographed source ↗</a>
        </article>)}</div>
        <div className={styles.filterHeading}><div><span className={styles.eyebrow}>HONEST COVERAGE REGISTER</span><h2>Still awaiting exact photos</h2></div><button onClick={()=>setShowMissing(x=>!x)} aria-expanded={showMissing}>{showMissing?"Hide unresolved list −":"See "+awaitingPhotos.length+" remaining research targets +"}</button></div>
        <p>For these variants I still haven't verified an individual, correctly identified, reusable photograph. Rather than repeat broken searches or show the wrong module, I've left the details visible without dead links.</p>
        {showMissing&&<div className={styles.missingGrid}>{awaitingPhotos.map(([generation,shape,title])=><article key={generation+shape+title}><span>{generation} · {shape}</span><h3>{title}</h3><p>No verified reusable standalone image yet; see the manufacturer and source cards above where applicable.</p></article>)}</div>}
      </section>
      <footer className={styles.footer}><div><h2>Why the sources matter.</h2><p>This catalogue is for recognising hardware and learning what different modules look like. The photographed example is not proof of motherboard compatibility. Wikimedia Commons files have individual creators and licences; open each photo's original page for credit and reuse conditions.</p><Link href="/ram-guide">← Back to the full RAM Explorer</Link></div><div><strong>RESEARCH COLLECTIONS</strong>{sources.map(s=><a target="_blank" rel="noopener noreferrer" key={s.href} href={s.href}>{s.label} ↗</a>)}<small>Curated 10 October 2026. Photos load from Wikimedia Commons with fallback to the source link if an image fails.</small></div></footer>
    </div>
    {active&&<Detail key={active.id} item={active} onClose={()=>setActive(null)} onCompare={onCompare} compared={compare.includes(active.id)} />}
    {selected.length>0&&<aside className={styles.compareTray} aria-label="Selected RAM comparison"><div><strong>{selected.length}/3 selected to compare</strong><div className={styles.picked}>{selected.map(x=><button key={x.id} onClick={()=>setActive(x)}>{x.title}</button>)}</div></div><button className={styles.clear} onClick={()=>setCompare([])}>Clear</button><button className={styles.compareOpen} onClick={()=>document.getElementById("ram-compare")?.scrollIntoView({behavior:"smooth"})}>Compare ↓</button></aside>}
    {selected.length>0&&<section className={styles.compareDock} id="ram-compare"><div className={styles.wrap}><h2>Compare your selected modules</h2><div className={styles.compareGrid}>{selected.map(x=><article key={x.id}><Photo key={x.id} entry={x}/><h3>{x.title}</h3><p>{x.generation} / {x.shape}</p><strong>{x.pins}</strong><p>{x.identify}</p><a href={commonsFilePage(x.file)} target="_blank" rel="noopener noreferrer">Source & licence ↗</a></article>)}</div></div></section>}
  </main></>;
}
