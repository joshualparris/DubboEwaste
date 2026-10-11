"use client";
import {useEffect,useState} from "react";
import {APPEARANCE_KEY,type Appearance,resolveTheme,validAppearance} from "@/lib/appearance";
import styles from "./appearance.module.css";

const choices=[
 {value:"light" as const,label:"Light",symbol:"☀",details:"Bright background"},
 {value:"dark" as const,label:"Dark",symbol:"☾",details:"Low-light workspace"},
 {value:"system" as const,label:"Use device",symbol:"◐",details:"Match your device"}
];
export default function AppearanceSettings(){
 const [choice,setChoice]=useState<Appearance>("light");
 const [systemDark,setSystemDark]=useState(false);
 const [notice,setNotice]=useState("");
 useEffect(()=>{
  const match=window.matchMedia("(prefers-color-scheme: dark)");
  const read=()=>{
   let value:unknown="light";
   try{value=window.localStorage.getItem(APPEARANCE_KEY);}catch{}
   setChoice(validAppearance(value)?value:"light");
   setSystemDark(match.matches);
  };
  read();
  const onSystem=()=>setSystemDark(match.matches);
  const onStorage=(e:StorageEvent)=>{if(e.key===APPEARANCE_KEY||e.key===null)read();};
  match.addEventListener?.("change",onSystem);
  window.addEventListener("storage",onStorage);
  return ()=>{match.removeEventListener?.("change",onSystem);window.removeEventListener("storage",onStorage);};
 },[]);
 function choose(next:Appearance){
  setChoice(next);
  const resolved=resolveTheme(next,window.matchMedia("(prefers-color-scheme: dark)").matches);
  // Apply without refresh, including header, forms, table and document colours.
  document.documentElement.dataset.theme=resolved;
  document.documentElement.style.colorScheme=resolved;
  try{window.localStorage.setItem(APPEARANCE_KEY,next);setNotice("Appearance saved on this device.");}
  catch{setNotice("Appearance changed, but your browser did not allow saving the preference.");}
 }
 return <section className="card" aria-labelledby="appearance-title">
  <h2 id="appearance-title">Appearance</h2>
  <p className="muted">Choose how AssetFlow looks. Changes apply immediately across your signed-in pages.</p>
  <div className={styles.options} role="group" aria-label="Colour theme">
   {choices.map(item=><button key={item.value} type="button"
     className={styles.option} onClick={()=>choose(item.value)}
     aria-pressed={choice===item.value}>
     <span className={styles.symbol} aria-hidden="true">{item.symbol}</span>
     <strong>{item.label}</strong><span className={styles.description}>{item.details}</span>
   </button>)}
  </div>
  <p className={styles.status} role="status">{notice||("Current: "+(choice==="system"?"Use device ("+(systemDark?"Dark":"Light")+")":choice==="dark"?"Dark":"Light"))}</p>
  <p className="muted small">Saved in this browser only. Other devices can have their own appearance; switching programmes does not reset it. Printable documents and labels keep their white paper background.</p>
 </section>;
}
