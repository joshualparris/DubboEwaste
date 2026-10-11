import type {MediaItem} from "@/lib/learning/media";
import LearningMediaPlayer from "@/components/LearningMediaPlayer";

/** Backward-compatible wrapper for older course screens.
 * Uses the same click-to-load player and verified media policy as /learn/media.
 */
export function CourseMediaPlayer({item}:{item:MediaItem}){
 if(item.type==="guide")return null;
 return <LearningMediaPlayer item={item}/>;
}
