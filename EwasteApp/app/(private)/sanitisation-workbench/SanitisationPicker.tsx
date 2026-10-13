"use client";
import {useMemo,useState} from "react";
type Entry={id:string;label:string;searchText?:string};
export function SanitisationPicker({name,label,items}:{name:string;label:string;items:Entry[]}){
 const [query,setQuery]=useState(""),[selected,setSelected]=useState<Entry|null>(null);
 const results=useMemo(()=>{const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);if(words.join("").length<2)return [];return items.filter(x=>words.every(w=>(x.label+" "+(x.searchText||"")).toLowerCase().includes(w))).slice(0,8)},[query,items]);
 return <div style={{display:"grid",gap:8,maxWidth:650}}>
  <label htmlFor={"picker-"+name}><strong>{label}</strong></label>
  <input id={"picker-"+name} type="search" value={query} disabled={!!selected} autoComplete="off" placeholder="Search asset code, brand, model or drive serial" style={{width:"100%",boxSizing:"border-box",minHeight:48,padding:10,fontSize:16}} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!selected){e.preventDefault();if(results.length===1){setSelected(results[0]);setQuery(results[0].label)}}}}/>
  <input name={name} type="hidden" value={selected?.id||""}/>
  {selected?<div role="status" style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",flexWrap:"wrap"}}><span>Selected: <strong>{selected.label}</strong></span><button type="button" onClick={()=>{setSelected(null);setQuery("")}}>Change</button></div>:query.trim().length>=2?<div style={{border:"1px solid #8886",borderRadius:8,overflow:"hidden"}}>
    {results.length?results.map(x=><button key={x.id} type="button" style={{width:"100%",textAlign:"left",padding:12,fontSize:16,minHeight:48,background:"transparent",color:"inherit",border:"0",borderBottom:"1px solid #8885"}} onClick={()=>{setSelected(x);setQuery(x.label)}}>{x.label}</button>):<p style={{padding:12,margin:0}}>No matches. Check the identity or register the device first.</p>}
  </div>:<p style={{fontSize:13,margin:0}}>Type at least two characters and tap the correct record.</p>}
 </div>;
}
