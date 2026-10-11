import Link from "next/link";
import {mediaItems} from "@/lib/learning/media";
import {getCourse} from "@/lib/learning/catalog";
import LearningMediaPlayer from "@/components/LearningMediaPlayer";
import styles from "../learning.module.css";
import libraryStyles from "./library.module.css";

export const metadata={title:"Podcasts & Videos | Dubbo Circular Learning"};

export default function LearningMediaLibrary(){
 const episodes=mediaItems.filter(m=>m.type==="podcast"&&getCourse(m.course));
 const videos=mediaItems.filter(m=>m.type==="video"&&getCourse(m.course));
 return <div className={styles.shell}>
  <nav className={styles.breadcrumbs}><Link href="/learn">Learning hub</Link><span>/</span><span>Podcasts &amp; Videos</span></nav>
  <header className={styles.courseHero}>
   <span className={styles.track}>Dubbo Circular Learning · Listening &amp; viewing</span>
   <h1>Podcasts and videos</h1>
   <p>{episodes.length} podcast episodes and {videos.length} video lessons. Play here on the website and return to each course to save your learning and reflections.</p>
   <p className={styles.hint}>Third-party audio and video players load only after you press Listen or Watch. Some providers may block playback in your browser. The original listening or watching link is always available.</p>
   <div className={libraryStyles.jump}><a href="#podcasts">Listen to podcasts ↓</a><a href="#videos">Watch videos ↓</a></div>
  </header>
  <section id="podcasts" className={styles.section}>
   <h2>Podcasts · {episodes.length}</h2>
   <div className={libraryStyles.list}>{episodes.map(item=><article className={libraryStyles.item} key={item.id}>
    <div className={styles.courseMeta}><span className={styles.track}>♫ Podcast</span><span className={styles.hint}>{item.provider}</span></div>
    <h3>{item.title}</h3><p>{item.summary}</p>
    <LearningMediaPlayer item={item}/>
    <div className={libraryStyles.links}><a href={item.url} target="_blank" rel="noopener noreferrer">Open original podcast ↗</a><Link href={"/learn/"+item.course+"#media"}>Open related course →</Link></div>
   </article>)}</div>
  </section>
  <section id="videos" className={styles.section}>
   <h2>Videos · {videos.length}</h2>
   <div className={libraryStyles.list}>{videos.map(item=><article className={libraryStyles.item} key={item.id}>
    <div className={styles.courseMeta}><span className={styles.track}>▶ Video</span><span className={styles.hint}>{item.provider}</span></div>
    <h3>{item.title}</h3><p>{item.summary}</p>
    <LearningMediaPlayer item={item}/>
    <div className={libraryStyles.links}><a href={item.url} target="_blank" rel="noopener noreferrer">Watch on provider ↗</a><Link href={"/learn/"+item.course+"#media"}>Open related course →</Link></div>
   </article>)}</div>
  </section>
  <p className={styles.hint}>Embedded playback is a learning aid, not proof of course completion. To record learning, enrol in the course and complete its reflection.</p>
 </div>;
}
