"use client";
import {useState} from "react";
import type {MediaItem} from "@/lib/learning/media";
import {mediaPlayback} from "@/lib/learning/playback";
import styles from "./LearningMediaPlayer.module.css";

export default function LearningMediaPlayer({item}:{item:MediaItem}){
 const [open,setOpen]=useState(false);
 const [failed,setFailed]=useState(false);
 const playback=mediaPlayback(item);
 if(!playback)return <div className={styles.fallback}><p>Inline playback is not available from this provider. Use the original episode or video page below.</p></div>;
 return <div className={styles.shell}>
  {!open?<button className={styles.open} type="button" onClick={()=>{setOpen(true);setFailed(false);}}>
   {item.type==="podcast"?"▶ Listen to podcast here":"▶ Watch video here"}
  </button>:<div className={styles.loaded}>
    <div className={styles.top}>
     <strong>{playback.label} · {item.provider}</strong>
     <button type="button" onClick={()=>{setOpen(false);setFailed(false);}}>Close player</button>
    </div>
    {playback.kind==="audio"?<audio controls preload="none" src={playback.src} className={styles.audio} onError={()=>setFailed(true)}>
     Your browser cannot play this audio source. Use the original link below.
    </audio>:<iframe className={["youtube","vimeo"].includes(playback.kind)?styles.video:styles.podcast}
     title={item.title+" — embedded "+playback.label}
     src={playback.src}
     allow={playback.kind==="youtube"?"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share":"autoplay; encrypted-media"}
     allowFullScreen={playback.kind==="youtube"||playback.kind==="vimeo"}
     loading="lazy"
     referrerPolicy="strict-origin-when-cross-origin"
    />}
    <p className={styles.hint} role="status">{failed?"The provider audio could not load. Choose Open original below.":"Playback is supplied by "+item.provider+". If your browser blocks it, open the original provider page below."}</p>
   </div>}
 </div>;
}
