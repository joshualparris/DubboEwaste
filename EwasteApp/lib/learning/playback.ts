import type {MediaItem} from "./media";

export type MediaPlayback={kind:"youtube"|"apple"|"audio";src:string;label:string};

/** Only approved provider players. Never put an arbitrary content URL into an iframe. */
export function mediaPlayback(item:MediaItem):MediaPlayback|null {
 if(item.type==="guide")return null;
 if(item.type==="podcast"&&item.audioUrl){
  try {
   const p=new URL(item.audioUrl);
   if(p.protocol==="https:" && ["traffic.libsyn.com","therestartproject.org"].includes(p.hostname)
     && p.pathname.toLowerCase().endsWith(".mp3")){
    return {kind:"audio",src:p.href,label:"Audio episode"};
   }
  }catch{return null;}
 }
 try {
  const u=new URL(item.url);
  if(u.protocol!=="https:")return null;
  if(item.type==="video"&&["www.youtube.com","youtube.com","m.youtube.com","youtu.be"].includes(u.hostname)){
   const v=u.hostname==="youtu.be"?u.pathname.substring(1):u.searchParams.get("v");
   if(v&&/^[\w-]{11}$/.test(v))return {kind:"youtube",src:"https://www.youtube-nocookie.com/embed/"+v+"?rel=0",label:"Video"};
  }
  if(item.type==="podcast"&&u.hostname==="podcasts.apple.com"
     && /^\/[a-z]{2}\/podcast\//.test(u.pathname)
     && /\/id\d+$/.test(u.pathname)
     && (!u.searchParams.has("i")||/^\d{10,15}$/.test(u.searchParams.get("i")??""))){
   const episode=u.searchParams.get("i");
   return {kind:"apple",src:"https://embed.podcasts.apple.com"+u.pathname+(episode?"?i="+episode:""),label:"Apple Podcasts episode"};
  }
 }catch{return null;}
 return null;
}
