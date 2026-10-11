/** Browser-only preference. Stored locally: does not touch learner or customer records. */
export const APPEARANCE_KEY="assetflow-appearance";
export type Appearance="light"|"dark"|"system";
export type ResolvedTheme="light"|"dark";
export function validAppearance(value:unknown):value is Appearance {
 return value==="light"||value==="dark"||value==="system";
}
export function resolveTheme(mode:Appearance,systemDark:boolean):ResolvedTheme {
 return mode==="system"?(systemDark?"dark":"light"):mode;
}
