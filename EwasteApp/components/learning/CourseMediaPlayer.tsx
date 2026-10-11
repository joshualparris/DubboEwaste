import type {MediaItem} from "@/lib/learning/media";

/** Publisher-hosted players. No media is copied, proxied or tracked by AssetFlow. */
export function CourseMediaPlayer({item}:{item:MediaItem}){
 if(item.audioUrl){
  return <div style={{margin:"1rem 0"}}>
   <audio controls preload="none" src={item.audioUrl} aria-label={"Listen to "+item.title} style={{display:"block",width:"100%",maxWidth:"100%"}}>
    Your browser does not support audio playback.
   </audio>
   <p style={{fontSize:".85rem",marginTop:".4rem"}}>Audio streams from the original publisher. If it cannot load, use “Open original podcast” below.</p>
  </div>;
 }
 const source=item.embedUrl??item.url;
 let player:string|null=null;
 try{
  const parsed=new URL(source);
  if(parsed.hostname==="www.youtube.com"||parsed.hostname==="youtube.com"){
   const id=parsed.searchParams.get("v")??parsed.pathname.match(/^\/embed\/([\w-]{11})$/)?.[1];
   if(id&&/^[\w-]{11}$/.test(id))player="https://www.youtube-nocookie.com/embed/"+id;
  }else if(parsed.hostname==="youtu.be"){
   const id=parsed.pathname.slice(1);if(/^[\w-]{11}$/.test(id))player="https://www.youtube-nocookie.com/embed/"+id;
  }else if(parsed.hostname==="vimeo.com"||parsed.hostname==="player.vimeo.com"){
   const id=parsed.pathname.match(/(?:\/video)?\/(\d+)$/)?.[1];
   if(id)player="https://player.vimeo.com/video/"+id;
  }else if(parsed.hostname==="podcasts.apple.com"){
   const episode=parsed.searchParams.get("i");
   if(/^\d{10,}$/.test(episode??""))player="https://embed.podcasts.apple.com"+parsed.pathname+"?i="+episode;
  }else if(parsed.hostname==="open.spotify.com"){
   const match=parsed.pathname.match(/^\/(?:embed\/)?(episode|show)\/([\w]+)$/);
   if(match)player="https://open.spotify.com/embed/"+match[1]+"/"+match[2];
  }
 }catch{}
 if(!player)return null;
 return <div style={{margin:"1rem 0",maxWidth:"100%"}}>
  <iframe title={"Play "+item.title} src={player} loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{display:"block",border:0,width:"100%",height:item.type==="podcast"?(player.includes("embed.podcasts.apple.com")?175:220):undefined,aspectRatio:item.type==="video"?"16 / 9":undefined,borderRadius:12}}/>
  <p style={{fontSize:".85rem",marginTop:".4rem"}}>Embedded player supplied by {item.provider}. If playback is blocked, open the original source below.</p>
 </div>;
}
