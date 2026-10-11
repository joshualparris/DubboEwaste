/** DB-backed observed skill evidence. Never infer this from lesson completion or an online simulation.
 * This is a local supervised bench sign-off, NOT a professional qualification or electrical licence.
 */
export const refurbSkillNames=[
 ["skill_consent","Consent and custody"],
 ["skill_diagnosis","Diagnostic judgement"],
 ["skill_compatibility","Parts and migration planning"],
 ["skill_safety","Safe handling"],
 ["skill_verification","Repair verification"],
 ["skill_handover","Customer handover"]
] as const;
export type RefurbSkillKey=typeof refurbSkillNames[number][0];
export type ReviewedPractice ={
 id:string; submitted_at:string; status:string;
 reviewer_id:string|null; reviewed_at:string|null; feedback:string|null; directly_observed:boolean;
 observed_on:string|null; observation_method:string|null; evidence_reference:string|null;
 assessor_attested:boolean;
 skill_consent:number|null; skill_diagnosis:number|null; skill_compatibility:number|null;
 skill_safety:number|null; skill_verification:number|null; skill_handover:number|null;
};
export function rubricTotal(review:ReviewedPractice):number|null {
 const values=refurbSkillNames.map(([key])=>review[key]);
 if(values.some(x=>typeof x!=="number"||!Number.isInteger(x)||x<0||x>3))return null;
 return (values as number[]).reduce((sum,n)=>sum+n,0);
}
export function independentlyObservedSignoff(review:ReviewedPractice,learnerId:string):boolean {
 const total=rubricTotal(review);
 return review.status==="approved"
  && review.directly_observed
  && review.assessor_attested
  && !!review.reviewer_id && review.reviewer_id!==learnerId
  && !!review.reviewed_at && !!review.observed_on
  && ["in_person","live_remote"].includes(review.observation_method??"")
  && !!review.evidence_reference && review.evidence_reference.trim().length>=8
  && total!==null&&total>=15
  && (review.skill_consent??0)>=2 && (review.skill_safety??0)>=2;
}
