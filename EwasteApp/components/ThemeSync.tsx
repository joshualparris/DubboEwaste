"use client";
import {useEffect} from "react";
import {APPEARANCE_KEY,resolveTheme,validAppearance} from "@/lib/appearance";

/** Continues to follow system theme and other tabs after the user leaves Settings. */
export function ThemeSync(){
 useEffect(()=>{
  const query=window.matchMedia("(prefers-color-scheme: dark)");
  function apply(){
   let stored:unknown="light";
   try{stored=window.localStorage.getItem(APPEARANCE_KEY);}catch{}
   const resolved=resolveTheme(validAppearance(stored)?stored:"light",query.matches);
   document.documentElement.dataset.theme=resolved;
   document.documentElement.style.colorScheme=resolved;
  }
  apply();
  const onStorage=(event:StorageEvent)=>{if(event.key===APPEARANCE_KEY||event.key===null)apply();};
  window.addEventListener("storage",onStorage);
  query.addEventListener?.("change",apply);
  return ()=>{
   window.removeEventListener("storage",onStorage);
   query.removeEventListener?.("change",apply);
  };
 },[]);
 return null;
}
