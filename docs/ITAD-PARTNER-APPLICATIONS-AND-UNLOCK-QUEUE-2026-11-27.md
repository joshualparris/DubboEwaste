# ITAD partner applications & unlock queue — 27 November 2026

**Status:** research/action plan, not yet executed. Draft outreach messages below are templates — fill in business details before sending.
**Scope:** free manufacturer/MDM programmes to join now, Authorised Service Centre (ASC) routes for Huawei/Vivo/Realme, NSW second-hand dealer licensing boundaries, the intake/chain-of-custody gate for FRP-locked devices, and Australian partnership leads (Project Phoenix, The Reconnect Project, MobileMuster).

> Full version with the intake decision diagram: [claude.ai artifact](https://claude.ai/artifact/VYyLu275CH2afNdihJ8xiD)

## Free programmes to join now

| Programme | Cost | What it gets you | Apply |
| --- | --- | --- | --- |
| ManageEngine Mobile Device Manager Plus (MSP edition) | Free up to 25 devices, permanent | Pre-provisioning/zero-touch enrollment so any future managed-fleet client device never hits FRP on reset | [manageengine.com](https://www.manageengine.com/mobile-device-management-msp/free-mobile-device-management-software.html) |
| Apple Independent Repair Provider (IRP) | Free to join; certification free | Genuine parts/tools at AASP prices, free training, repair manuals, diagnostics. Does **not** grant Activation Lock removal on its own | [support.apple.com/en-au/irp-program](https://support.apple.com/en-au/irp-program) |
| MobileMuster repair-partner stream | Free | Free pick-up/processing for loose batteries and damaged components pulled during repairs, plus annual recycling reporting you can show clients | [mobilemuster.com.au/join-us](https://www.mobilemuster.com.au/join-us/) |
| The Reconnect Project | Partnership enquiry, no fee | An AU charity already refurbishing phones and training technicians (Penshurst, Sydney) — worth a direct regional-partnership approach | thereconnectproject.com.au |

Start with ManageEngine (five-minute sign-up, immediately useful for any MDM client work) and Apple IRP (free, and the certification pathway is a credibility signal even before it unlocks anything).

## Project Phoenix — the closest existing AU model

AMTA's Project Phoenix pilot (outcomes reported 24 March 2026) refurbished 100 low-value phones through DV Safe Phone and the KARI Foundation, backed by Optus, PhoneCycle and AMTA. Each device was wiped, checked against the national Lost and Stolen Register, refurbished, and paired with an Optus Donate Your Data Crisis SIM. This is exactly the structure worth copying — the Lost/Stolen Register check before any resale-track work is the national equivalent of the ownership-check gate below.

Approach AMTA directly about Project Phoenix's next phase, and DV Safe Phone / KARI Foundation as device-distribution partners for a regional (Dubbo) version. Source: [AMTA pilot outcomes report](https://amta.org.au/?p=4587).

## Authorised Service Centre routes — Huawei, Vivo, Realme

None of these three publish a self-serve "apply to become an ASC" form the way Apple's IRP does — all three route new-partner enquiries through their regional consumer support channel rather than a dedicated partner portal. Expect a human conversation, not a form submit.

| Brand | Current AU channel | Known detail | Next step |
| --- | --- | --- | --- |
| Huawei | consumer.huawei.com/au/support | Huawei AU previously ran its service centre network through repairer **Happytel** (56+ collection points, 2 service centres, as of 2019) — status unconfirmed since, and Huawei scaled back global enterprise/ASC programmes after 2019 US restrictions. No public ITAD/bulk-unlock portal found. | Contact Huawei AU consumer support directly and ask to be referred to their current AU service-partner contact; treat Huawei devices as "recycle only" by default until a channel confirms otherwise |
| Vivo | vivo.com/au/support/service-center | vivo Mobile Australia Pty Ltd issues the AU warranty; no partner-application page found | Email/contact vivo Australia's support team directly, ask for the partner/service-centre enquiry contact |
| Realme | realme.com/au/support | realme Mobile Australia handles repairs by appointment at authorised service centres; no partner-application page found | Same approach — contact realme AU support, ask for the authorised-partner enquiry route (Realme and Vivo are both BBK Electronics brands, so one regional BBK contact may cover both) |

For all three: lead with your MSP/ITAD registration, device volumes, and a sample of the chain-of-custody policy below — that's what a regional partner team will actually want to see before escalating you past first-line support.

## NSW second-hand dealer licensing

Whether a second-hand dealer licence applies depends on which activity you're doing, not on the business as a whole:

| Activity | Second-hand dealer licence |
| --- | --- |
| Repairing customers' own devices | Generally not required |
| Recycling and rubbish-collection programmes | Exempt |
| Qualifying charitable fundraising | Exempt |
| Buying/reselling devices you don't already own (trade-in, bulk buy, resale) | Check — this is the activity that typically triggers the licence |

Keep these as separate tracked activities in your business structure: a repair job and a charitable device-reuse programme sit outside the licence requirement, but a resale/trade-in arm likely doesn't.

## Intake & chain-of-custody policy

Every device gets its IMEI/serial logged against the asset manifest at intake, before anyone touches a reset. That log state (locked/unlocked, FRP present) is the baseline a resale decision is checked against later — this mirrors the national Lost/Stolen Register check Project Phoenix runs before any device goes to reuse.

```
Log IMEI/serial against asset manifest
        │
        ▼
  Ownership doc on file?
     │           │
    yes          no
     │           │
     ▼           ▼
Resale-grade   Recycle only,
unlock         no resale
(OEM/ASC or    (parts/material
MDM channel)   stream)
```

**"Ownership doc on file" means one of:** a corporate client's asset disposal certificate or lease-return manifest listing the serial; a bulk trade-in/buyback agreement with the source; or, for individually-sourced stock, a clean GSMA blacklist check plus a seller ownership declaration.

A device that fails this check is flagged **recycle only, no resale** — permanently, not just until someone finds a bypass. That's the legal firewall: nothing without documented ownership goes on a resale shelf unlocked, regardless of which tool or channel could technically clear the lock.

This should be read alongside the existing [INTAKE-POLICY.md](INTAKE-POLICY.md) (DubboEwaste) and [FRP-OWNERSHIP-TRANSFER-AND-MOBILE-REUSE-2026-11-25.md](FRP-OWNERSHIP-TRANSFER-AND-MOBILE-REUSE-2026-11-25.md) — this document adds the manufacturer/MSP partner-application angle on top of the existing ownership-transfer research.

## Draft outreach — ready to send

**To The Reconnect Project (partnership enquiry):**

> Subject: Regional refurbishment partnership — [your business], Dubbo NSW
>
> Hi, I run [your business], an MSP/ITAD operation based in Dubbo. We're building out a device-refurbishment and reuse pipeline and would like to explore a regional partnership with The Reconnect Project — either as a device-distribution partner for our region, or by adopting your refurbishment/training model locally. We have [X] units a month coming through intake, documented chain-of-custody, and a wipe/QA process already in place. Keen to learn how your training program and distribution network operate so we can plug in without duplicating what you've already built. Happy to call or visit.

**To AMTA (Project Phoenix):**

> Subject: Regional expansion interest — Project Phoenix
>
> Hi, I read the March 2026 Project Phoenix pilot outcomes report with interest. I run [your business], an ITAD/MSP operation in Dubbo, NSW, and would like to explore whether Project Phoenix is expanding beyond its initial partners (Optus, PhoneCycle, DV Safe Phone, KARI Foundation) or whether AMTA would support a regional pilot modelled on it — including the Lost/Stolen Register check step, which we'd like to build into our own intake process regardless. Happy to share our current device volumes and process documentation.

Send both this week while the pilot is fresh; lead with device volume and your existing chain-of-custody process in both — that's the detail that turns a cold email into a partnership conversation.

## Sources

- [ManageEngine free MDM](https://www.manageengine.com/mobile-device-management-msp/free-mobile-device-management-software.html)
- [Apple IRP — Australia](https://support.apple.com/en-au/irp-program)
- [MobileMuster — Join Us](https://www.mobilemuster.com.au/join-us/)
- [MobileMuster — how it supports the repair industry](https://www.mobilemuster.com.au/how-mobilemuster-supports-the-repair-industry/)
- [AMTA — Project Phoenix pilot outcomes](https://amta.org.au/?p=4587)
- [Huawei Australia support](https://consumer.huawei.com/au/support/)
- [vivo Australia service centre](https://www.vivo.com/au/support/service-center)
- [realme Australia support](https://www.realme.com/au/support/faq)
