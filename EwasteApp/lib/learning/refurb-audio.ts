/** Audio-first, copyright-original chapter scripts for the laptop refurbishment course.
 * The browser voices this text using its local speech synthesis engine; no MP3
 * or recorded human narration is claimed, and learner data never enters a prompt.
 */
export type RefurbAudioChapter={id:string;title:string;duration:string;transcript:string;recall:string};
export const refurbAudioChapters:RefurbAudioChapter[]=[
 {id:"consent",title:"1. Protect data and diagnose the slow HDD",duration:"About 3 minutes",transcript:`Imagine a customer hands you an HP 250 G3 and says, "It's terribly slow. Can you fit an SSD?" Your first tool is not a screwdriver. It is a question: "What data matters to you, and what have you authorised me to do?"

Confirm who owns the machine, who can approve reading or altering its storage, which files must survive and how the original hard drive will be handled. If the device was donated but the drive contains an unknown owner's data, don't open those files, clone them or erase them. Move the storage medium into restricted custody under the approved intake process.

Next, record a repeatable baseline. Time a cold start and two ordinary applications. Identify the existing drive, note free space and RAM pressure, and review a read-only health report where possible. Mechanical drives can be sluggish during random reads. But a slow computer may also be paging because it lacks memory, throttling from heat or running excessive startup programs. High active disk time is evidence, not a diagnosis.

If the drive clicks, disappears, shows pending sectors or has failing self-tests, routine surface scans and repeated cloning are not low-risk troubleshooting. Stop. Tell the customer that recovery choices should be considered before stressing the drive further. A healthy laptop is replaceable; family photos might not be.

One last distinction: a clone copies a system onto another disk. It is not automatically an independent, verified backup. Know exactly which drive is the source and which will be overwritten before running any migration tool.`,recall:"Without notes: name the consent gate, two other causes of slowness, and one hard stop for a failing drive."},
 {id:"fit",title:"2. Match SATA, prepare and migrate",duration:"About 3 minutes",transcript:`The word SSD does not define a connector. An old laptop with a 2.5-inch SATA hard drive usually needs a 2.5-inch SATA solid-state drive in its original drive bay. M.2 is a card shape, not a promise of compatibility. NVMe, SATA signalling, connector keys, bay height, bracket and laptop firmware are separate questions.

For the HP 250 G3, use the exact HP maintenance and service guide. Don't use another HP model's screw order as a guarantee. With permission and a verified backup, shut the laptop down, unplug external power and follow the manual for battery isolation, ESD precautions, drive removal and reassembly. Inspect the original caddy and screws. Transfer the bracket carefully, connect the compatible SSD without force, and positively identify both physical drives.

Now choose the migration method according to the customer's needs. A clone can preserve an existing authorised Windows setup but may reproduce problems. A clean installation creates a fresh supported system yet requires authorised data restoration and application setup. A damaged HDD may need recovery-focused handling rather than a normal clone.

Capacity matters. If an old hard drive has 300 gigabytes of used data, a nominal 256-gigabyte SSD is not big enough. EFI and recovery partitions take room too. You need a suitable larger drive, or an explicitly approved and independently backed-up reduction plan. Never attempt to fit data by accidentally overwriting the source.

When the firmware recognises the new SSD, that proves device detection. It does not mean a valid bootloader is present. If the screen says no boot device, check the intended boot entry, UEFI versus legacy mode and the installation path before declaring a replacement drive defective.`,recall:"Explain why an M.2 NVMe card is not a drop-in replacement for a 2.5-inch SATA drive, and why detection is not the same as bootability."},
 {id:"prove",title:"3. Verify, price and seek observed sign-off",duration:"About 3 minutes",transcript:`The laptop boots in twenty seconds. Can you declare victory? Not yet. A single boot is encouraging, but it doesn't establish stability, healthy storage or the safety of the customer's data.

Repeat the cold boot and restart. Confirm the SSD's model and capacity in firmware and the operating system. Review health indicators, test normal peripherals and inspect thermal behaviour. If the customer authorised file migration, open representative files with permission and compare what arrived against the verified independent backup. A progress bar marked complete is not a file-integrity test.

Document the previous hard drive separately. Is it to be returned, securely retained, sanitised under an approved method or sent through a secure disposal channel? Never place a potentially data-bearing drive in casual parts storage. Write down unresolved faults and honest limits, rather than silently calling the machine refurbished.

A quote also needs evidence. For a fictional example, a thirty-dollar SSD, forty-five minutes of labour at sixty dollars an hour, and five dollars in testing totals eighty dollars. At a twenty percent gross margin, divide eighty by zero point eight to get a one-hundred-dollar price before GST. A twenty percent markup instead would be ninety-six dollars. Quote optional backups, recovery, tax and contingencies separately as appropriate.

Professional mastery is different from ticking a lesson. An independent, authorised assessor must directly watch the technician obtain consent, reason from evidence, verify compatible parts, handle power and data safely, complete checks and explain the handover. Each of six categories receives an evidence-based score from zero to three. Fifteen out of eighteen is the minimum here, with no weak consent or safety result. The assessor records a date, a redacted evidence reference, feedback and their own attestation. Until then the status remains not independently signed off.

Your final challenge: explain what observation would make you stop a job, and how the customer would know that their files and original drive are accounted for.`,recall:"List three post-repair tests, calculate margin rather than markup, and identify what a supervisor must actually observe before approval."}
];
