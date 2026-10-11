import { courses, type LearningCourse } from "./catalog";
import { deepPathwayFor } from "./deep-pathways";
import { mediaForCourse } from "./media";

/**
 * Transparent content coverage review, not a measurement of learner ability.
 * "mastery-ready" requires independent review of evidence/rubrics and is never
 * assigned merely because three lessons or an automated quiz were completed.
 * Updated when the source catalogue changes; no client or learner data read.
 */
export type QualityStage = "orientation-only" | "developing" | "substantial" | "mastery-ready";
export type LearningQuality = {
  id: string;
  stage: QualityStage;
  guideCount: number;
  videoCount: number;
  podcastCount: number;
  targetedResources: number;
  workedCases: number;
  hasPracticalPrompt: boolean;
  hasAudioCompanion: boolean;
  evidence: string[];
  gaps: string[];
};
export function assessLearningQuality(course: LearningCourse): LearningQuality {
  const media = mediaForCourse(course.id);
  const deep = deepPathwayFor(course.id);
  const videos = media.filter(x=>x.type==="video").length;
  const podcasts = media.filter(x=>x.type==="podcast").length;
  const guides = media.filter(x=>x.type==="guide").length;
  const hasPracticalPrompt = course.lessons.every(x=>x.practice.trim().length>=35);
  const hasAudioCompanion = course.id==="repair-laptop-refurb"; // original three-chapter narrated text companion
  const workedCases = deep?.cases.length ?? 0;
  const targetedResources = deep?.resources.length ?? 0;
  const substantial = Boolean(deep && workedCases>=3 && targetedResources>=2 && hasPracticalPrompt);
  const stage: QualityStage = substantial ? "substantial" : media.length>0 ? "developing" : "orientation-only";
  const gaps: string[] = [];
  if(!substantial) gaps.push("Needs course-specific worked cases with model reasoning, error analysis and a competence boundary");
  if(!videos) gaps.push("No linked video demonstration");
  if(!podcasts&&!hasAudioCompanion) gaps.push("No linked audio/podcast alternative");
  if(media.length<2 && !substantial) gaps.push("Only one external source; needs a second independent teaching method");
  if(!hasPracticalPrompt) gaps.push("Some lessons lack substantial applied practice instructions");
  gaps.push("Individual observed skills sign-off requires an independent, recorded supervisor assessment; course catalogue data cannot prove it");
  return {
    id: course.id, stage, guideCount:guides, videoCount:videos, podcastCount:podcasts, hasAudioCompanion,
    targetedResources, workedCases, hasPracticalPrompt,
    evidence:[
      `${course.lessons.length} orientation lessons`,
      `${media.length} curated media references (${videos} video, ${podcasts} audio, ${guides} reading)`,
      `${workedCases} worked applications in an advanced pathway`,
      ...(hasAudioCompanion?["Three original chapters with device speech playback and full transcripts"]:[]),
      "Adaptive question checks are present, but correct answers alone do not establish ability"
    ],
    gaps
  };
}
export const learningQuality = courses.map(assessLearningQuality);
export const qualityCounts = {
  total: learningQuality.length,
  orientation:learningQuality.filter(x=>x.stage==="orientation-only").length,
  developing:learningQuality.filter(x=>x.stage==="developing").length,
  substantial:learningQuality.filter(x=>x.stage==="substantial").length,
  masteryReady:learningQuality.filter(x=>x.stage==="mastery-ready").length
};
export function qualityStageLabel(stage: QualityStage) {
  return {
    "orientation-only":"Orientation only",
    developing:"Developing · extra sources",
    substantial:"Substantial · applied study",
    "mastery-ready":"Mastery-ready · independently verified"
  }[stage];
}
