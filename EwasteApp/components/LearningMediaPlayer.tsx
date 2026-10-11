"use client";
import {useState} from "react";

type Kind="podcast"|"video";
function playableEmbed(raw:string,kind:Kind):string|null {
 try {
  const u=new URL(raw);
  if(u.protocol!=="https:")return null;
  const host=u.hostname.toLowerCase(),parts=u.pathname.split("/").filter(Boolean);
  if(kind==="video"&&(host==="www.youtube-nocookie.com"||host==="www.youtube.com"||host==="youtube.com"||host==="m.youtube.com")){
   const id=u.pathname==="/watch"?u.searchParams.get("v"):parts[0]==="shorts"||parts[0]==="live"||parts[0]==="embed"?parts[1]:null;
   return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?"https://www.youtube-nocookie.com/embed/"+id:null;
  }
  if(kind==="video"&&host==="youtu.be"&&/^[a-zA-Z0-9_-]{11}$/.test(parts[0]??""))return "https://www.youtube-nocookie.com/embed/"+parts[0];
  if(kind==="video"&&(host==="vimeo.com"||host==="player.vimeo.com")){
   const id=parts[0]==="video"?parts[1]:parts[0];
   return /^\d+$/.test(id??"")?"https://player.vimeo.com/video/"+id:null;
  }
  if(kind==="podcast"&&host==="open.spotify.com"){
   const idx=parts[0]==="embed"?1:0,kind=parts[idx],id=parts[idx+1];
   if((kind==="episode"||kind==="show")&&/^[a-zA-Z0-9]{15,32}$/.test(id??""))return "https://open.spotify.com/embed/"+kind+"/"+id+"?utm_source=generator";
  }
  if(kind==="podcast"&&(host==="podcasts.apple.com"||host==="embed.podcasts.apple.com")&&parts.includes("podcast")&&/\/id\d+/.test(u.pathname)){
   const episode=u.searchParams.get("i"),query=episode&&/^\d+$/.test(episode)?"?i="+episode:"";
   return "https://embed.podcasts.apple.com"+u.pathname+query;
  }
 }catch{}
 return null;
}
/** Load third-party media only when the learner explicitly chooses Play.
 * Non-embeddable publisher pages remain accessible through a direct source link.
 * We do not download or rehost audio, claim offline listening, or fake an audio button.
 */
export default function LearningMediaPlayer({url,title,kind,originalUrl}:{url:string;title:string;kind:Kind;originalUrl?:string}){
 const [open,setOpen]=useState(false);
 const embed=playableEmbed(url,kind);
 return <div style={{margin:"12px 0",minWidth:0}}>
  {embed ? (open ? <>
    <iframe title={title+" — publisher player"} src={embed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write" allowFullScreen style={{display:"block",width:"100%",height:kind==="video"?270:kind==="podcast"&&embed.includes("podcasts.apple.com")?185:152,border:0,borderRadius:12,background:"#15241b"}}/>
    <button type="button" onClick={()=>setOpen(false)} style={{padding:"10px 0",border:0,background:"transparent",textDecoration:"underline",color:"inherit",cursor:"pointer"}}>Close player</button>
   </> : <button type="button" onClick={()=>setOpen(true)} style={{minHeight:44,padding:"10px 16px",borderRadius:9,border:"1px solid #5c916c",color:"#eaffed",background:"#215839",cursor:"pointer",fontWeight:700}}>
    {kind==="video"?"▶ Watch video on this page":"▶ Listen here"}
   </button>) : <p style={{fontSize:13,opacity:.86,margin:"8px 0"}}>This publisher does not provide a supported in-page player for this link. Use the original listening page below.</p>}
  <p style={{fontSize:12,opacity:.83,margin:"8px 0"}}>{embed?"Playback is provided by "+(embed.includes("spotify")?"Spotify":embed.includes("apple")?"Apple Podcasts":"YouTube")+". Region, account, browser or publisher restrictions may affect playback; the original link remains available.":"No playable audio file is hosted by this site."}</p>
  <a href={originalUrl??url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",textDecoration:"underline",fontWeight:650,minHeight:28,color:"inherit"}}>
   {kind==="video"?"Watch on the original website ↗":"Listen on the original website ↗"}
  </a>
 </div>;
}
