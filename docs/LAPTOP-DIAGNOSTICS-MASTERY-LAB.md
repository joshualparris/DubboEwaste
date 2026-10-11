# Laptop Diagnostics Mastery Lab — flagship practical pathway

**Audience:** AssetFlow / DubboEwaste Academy technicians and Repair Café volunteers. **Status:** instructor-ready learning resource; not an accredited competency certificate.

## Outcomes and evidence
Learners must: (1) protect owner data and recognise stop-work hazards; (2) formulate at least three plausible hypotheses; (3) select the safest high-information test; (4) interpret positive *and* negative findings; (5) calculate repair economics; (6) document verification and communicate uncertainty.

## Diagnostic method
1. **Intake:** record symptoms in the owner's words, identity/consent, known liquid damage, prior attempts, and whether data may be accessed. Do not boot an unknown drive or alter storage without authority.
2. **Safety gate:** swelling, heat, smell, exposed mains, damaged charger, liquid ingress or suspect battery => isolate and escalate. Never open mains adapters or probe energised mains circuitry.
3. **Hypotheses:** distinguish power, POST, display, storage and operating-system failures. Give each an evidence-based confidence level, not a guess.
4. **Discriminating tests:** start with observation, known-good *compatible* external accessories and documented vendor diagnostics; choose tests that separate competing causes.
5. **Decision:** repair, refer, salvage or recycle with cost, time, risk, parts compatibility and data protection accounted for.
6. **Release:** repeat the original failure condition, verify the repair, record residual limitations, and obtain appropriate sign-off.

## Case A — HP laptop: internal black screen, external HDMI works
**Initial evidence:** power LED lit; external monitor displays a stable desktop. This supports a functioning graphics path but does not establish that the internal LCD itself is defective.

**Learner task:** Build a fault tree with at least: panel, eDP/LVDS cable or connector, backlight/power, firmware/display selection, and board-side internal display circuitry. Prioritise safe tests; explain what each result changes.

**Evidence cards (reveal progressively):**
- A1: external image remains stable through BIOS. Ask whether OS corruption is a leading hypothesis.
- A2: internal panel is not detected in firmware/OS. Ask whether this distinguishes panel from cable definitively (it does not).
- A3: donor panel has the same diagonal size but unknown connector, voltage, mounting and signalling. Ask whether it is safe to plug in (no).
- A4: model-specific service information identifies compatible panel/cable part numbers. Require documented comparison before substitution.

**Expert answer:** avoid declaring a failed LCD solely from HDMI success. Verify model/revision, connector position/pinout, signalling, voltage, mount and cable routing before a donor-panel trial; stop if uncertain. Never perform blind swaps.

## Case B — Powers on, no POST
**Evidence:** charging LED works; fan pulses; no vendor logo. Ask learner to distinguish charger/battery, memory, firmware, motherboard and display. Require an observation/test table: hypothesis, predicted observation, actual observation, next action. Do not equate fan spin with successful POST. A known-good compatible adapter and manufacturer blink-code guidance are useful before opening. Internal work only with battery disconnected and appropriate ESD precautions.

## Case C — BIOS sees storage intermittently
**Evidence:** drive detected on some cold starts, SMART warning in vendor diagnostics, customer needs files. Learner must first stop destructive testing, preserve data authority, prioritise appropriate recovery referral/backup, then assess drive, connector and firmware alternatives. No wiping, reinstalling or repeated stress tests on a potentially failing drive without consent and a data-risk decision.

## Case D — Overheating under load
**Evidence:** idle normal, temperatures spike under load, exhaust restricted. Compare obstructed vents, failed fan, poor thermal interface, sensor/reporting error and background workload. Require a measured before/after thermal and fan-behaviour record, safe cleaning procedures, and a sustained post-repair verification. Never assert a temperature alone proves a particular component failed.

## Case E — Repair economics
Given parts A$85, labour 1.5 h at A$60/h, expected resale A$220, 20% chance of a further A$80 fault, and A$15 consumables: expected direct cost = 85+90+16+15 = **A$206**, margin before overhead/warranty = **A$14**. Ask whether the repair is commercially sensible, and distinguish a volunteer repair from a resale business. Learner must explain opportunity cost and warranty risk.

## Adaptive assessment specification
- Begin with a diagnostic baseline: three novel short-answer or scenario decisions.
- Track separate mastery dimensions: safety, hypothesis quality, test selection, evidence interpretation, economics, verification.
- Two sound decisions in a dimension advance difficulty; two weak decisions trigger a worked example and a new easier variant; do not award mastery from repeated identical questions.
- At higher levels withhold obvious clues and introduce conflicting evidence; require a written explanation and a falsifiable prediction before revealing results.
- Never use answer length or option position as a cue; randomise plausible distractors and require reasoning. Feedback must explain *why* a tempting alternative fails.
- Require a delayed retrieval case after 2–3 days and a transfer case after 1–2 weeks; do not equate a completion click with retention.

## Practical competency rubric (0–3 each; 18 points)
| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Safety/data | unsafe | hazards partly noticed | correct boundaries | anticipates and documents |
| Hypotheses | one unsupported guess | incomplete | plausible alternatives | ranked with falsifiers |
| Tests | destructive/random | weak discrimination | safe useful sequence | maximises information efficiently |
| Interpretation | overclaims | partial | evidence-based | handles ambiguity |
| Repair decision | no economics | rough | cost/risk considered | defensible alternatives |
| Verification | none | superficial | repeatable checks | documented release and limitations |

**Pass rule:** >=15/18, at least 2 in every criterion, **3 in safety/data**, and no critical unsafe action. A fail routes to targeted remediation and a different case. A pass indicates simulated competence only; supervised real-world demonstration is a separate requirement.

## Multimedia and accessibility production brief
Create a labelled laptop display-signal diagram (GPU -> cable -> panel/backlight), a photo-based cable-compatibility comparison, captions/transcripts for a 5–8 minute diagnostic demonstration, and a narrated case walkthrough. Use descriptive alt text, keyboard-accessible controls and text alternatives. Do not mark assets as delivered until verified.

## External reference starting points (review before linking in the live LMS)
- iFixit PC laptop repair: https://www.ifixit.com/Device/PC_Laptop
- SparkFun troubleshooting: https://learn.sparkfun.com/tutorials/sparkfun-troubleshooting-tips/all
- CompTIA A+ troubleshooting objectives: consult current official objectives and version.

## Acceptance tests for a future interactive implementation
- Wrong but plausible diagnosis does not pass without supporting evidence.
- An unsafe donor panel swap triggers stop-work feedback.
- Correct tests unlock distinct findings; repeated guesses cannot brute-force mastery.
- Assessment records skill dimensions, not only percentage correct.
- Mobile/keyboard access, accessible labels, persistence, authentication and progress isolation tested.
- No simulated completion is presented as certified practical competence.
