"use client";
import {useEffect,useRef,useState} from "react";
import {refurbAudioChapters} from "@/lib/learning/refurb-audio";
import styles from "./RefurbAudioCompanion.module.css";

type PlayerState="stopped"|"playing"|"paused";
export default function RefurbAudioCompanion(){
 const [chapter,setChapter]=useState(0);
 const [rate,setRate]=useState("1");
 const [supported,setSupported]=useState<boolean|null>(null);
 const [state,setState]=useState<PlayerState>("stopped");
 const [status,setStatus]=useState("Select a chapter and press Listen.");
 const token=useRef(0);
 const selected=refurbAudioChapters[chapter];
 const stop=()=>{
  token.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window) window.speechSynthesis.cancel();
  setState("stopped");
 };
 useEffect(()=>{
  setSupported(typeof window!=="undefined"&&"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window);
  return ()=>{token.current++;if("speechSynthesis" in window)window.speechSynthesis.cancel();};
 },[]);
 const play=()=>{
  if(!supported)return;
  const synth=window.speechSynthesis;
  if(state==="paused"){synth.resume();setState("playing");setStatus("Narration resumed.");return;}
  stop();
  const session=token.current;
  const blocks=selected.transcript.split(/\n\s*\n/).map(t=>t.trim()).filter(Boolean);
  let position=0;
  function speakNext(){
   if(token.current!==session)return;
   if(position>=blocks.length){setState("stopped");setStatus("Chapter complete. Try the recall question without looking.");return;}
   const utter=new SpeechSynthesisUtterance(blocks[position++]);
   utter.lang="en-AU";utter.rate=Number(rate);
   utter.onend=speakNext;
   utter.onerror=()=>{if(token.current===session){setState("stopped");setStatus("Audio stopped. Read the full transcript below instead.");}};
   synth.speak(utter);
  }
  setState("playing");setStatus("Playing "+selected.title);
  speakNext();
 };
 return <section className={styles.audio} aria-labelledby="refurb-audio-title">
  <div className={styles.header}><span className={styles.eyebrow}>LISTEN & RECALL</span><h2 id="refurb-audio-title">Laptop repair audio companion</h2><p>Three original spoken chapters covering the same decisions as the written course. The device's speech engine reads them aloud; no recording or customer data is uploaded.</p></div>
  <div className={styles.controls}>
   <label htmlFor="audio-chapter">Choose chapter<select id="audio-chapter" value={chapter} onChange={e=>{stop();setChapter(Number(e.target.value));setStatus("Chapter selected.");}}>{refurbAudioChapters.map((x,i)=><option key={x.id} value={i}>{x.title}</option>)}</select></label>
   <label htmlFor="audio-rate">Playback speed<select id="audio-rate" value={rate} onChange={e=>{stop();setRate(e.target.value);setStatus("Playback speed changed; press Listen.");}}><option value="0.85">0.85×</option><option value="1">1×</option><option value="1.15">1.15×</option></select></label>
   <div className={styles.buttons}><button type="button" disabled={supported!==true} onClick={play}>{state==="paused"?"Resume":state==="playing"?"Restart chapter":"Listen to chapter"}</button><button type="button" disabled={state!=="playing"} onClick={()=>{window.speechSynthesis.pause();setState("paused");setStatus("Paused.");}}>Pause</button><button type="button" disabled={state==="stopped"} onClick={()=>{stop();setStatus("Stopped.");}}>Stop</button></div>
   <p className={styles.small} role="status" aria-live="polite">{supported===false?"Speech playback is unavailable in this browser. The full text remains below.":status}</p>
  </div>
  <div className={styles.transcript}><p><strong>{selected.duration} at normal speed</strong></p><details><summary>Read complete chapter transcript</summary>{selected.transcript.split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>)}</details><p><strong>Recall without notes:</strong> {selected.recall}</p></div>
  <p className={styles.small}>The accompanying independently hosted podcasts are listed in the course's Watch, listen and reflect section. Speech synthesis is an audio accessibility option, not proof of listening or competence.</p>
 </section>;
}
