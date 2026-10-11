import type {MediaItem} from "@/lib/learning/media";
import LearningMediaPlayer from "@/components/LearningMediaPlayer";

/** All publisher-licensed audio remains hosted by its source.
 * Original podcasts with documented direct MP3 URLs play via HTML5 audio.
 * YouTube, Spotify, Vimeo and Apple Podcasts use opt-in embedded players.
 */
export function CourseMediaPlayer({item}:{item:MediaItem}){
 if(item.type==="guide")return null;
 if(item.audioUrl){
  return <div style={{margin:"1rem 0",maxWidth:"100%"}}>
   <audio controls preload="none" src={item.audioUrl} aria-label={"Listen to "+item.title} style={{display:"block",width:"100%",maxWidth:"100%"}}>
    Your browser does not support audio playback.
   </audio>
   <p style={{fontSize:".85rem",marginTop:".4rem"}}>Actual recording streamed from its original publisher. If it doesn't play, use the source link below. We do not host this audio.</p>
  </div>;
 }
 return <LearningMediaPlayer
  url={item.embedUrl??item.url}
  originalUrl={item.url}
  title={item.title}
  kind={item.type}
 />;
}
