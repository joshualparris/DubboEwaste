# Repair Café Dubbo Public Website Specification

<!-- DOCUMENTATION-SYNC-2026-10-09 -->
> **9 October 2026 documentation reconciliation:** This is the 8 October **public-site specification**, not a current build checklist. The live public route is `/repair-cafe-dubbo` with feedback support and publication-gated upcoming events. Private volunteer rostering, Event Desk, knowledge, reports and station dispatch now live under `/repair-cafe-volunteers/*`; keep private details off the public home page. **Do not claim a venue/event is confirmed** without records and host approval. See [current verified features](LIVE-FEATURES-AND-VERIFICATION-2026-10-09.md) and [documentation freshness index](DOCUMENTATION-INVENTORY-AND-FRESHNESS-2026-10-09.md).


**Date:** 8 October 2026  
**Status:** Build specification based on Dubbo circular-economy, venue and website-engagement research.

## Goal

Create a public, mobile-first website that invites **all Dubbo residents** to help shape a potential Repair Café.

The site must not pretend the Repair Café already operates.

Primary conversion:
**Submit community feedback / expression of interest.**

Secondary conversion:
**Volunteer / partner / venue offer.**

## Core message

**Fix it. Learn it. Keep it in use.**

A proposed Repair Café Dubbo would be a friendly community event where owners stay with their item and learn alongside volunteers. It is not a free commercial drop-off repair shop.

## Audience

- people with broken household items;
- women and men;
- teenagers/young adults;
- older people;
- families;
- people with disability;
- culturally diverse residents;
- Aboriginal residents;
- low-income households;
- hobbyists;
- trades/repair professionals;
- local businesses;
- charities/community organisations;
- potential venue hosts;
- people who simply want to learn.

## Page sections

1. Hero + truthful project status.
2. “How it could work” in three steps.
3. Repair categories.
4. “You don’t have to be a fixer” volunteer roles.
5. Dubbo research finding: strong local repair skills, missing inclusive repair-learning bridge.
6. Researched venue ideas with “suggest another” CTA.
7. Rotating-pop-up explanation.
8. Safety / what a first pilot would likely exclude.
9. Community feedback and volunteer form.
10. FAQ.
11. Research/source links.

## Form requirements

Must be a **real persisted form**, not mailto or fake success UI.

Minimum:
- participation interests;
- repair categories;
- volunteer roles;
- confidence/experience;
- preferred venue;
- venue suggestion;
- preferred timing;
- counterfactual disposal behaviour;
- ideas;
- accessibility notes;
- optional first name/postcode/email;
- contact consent;
- privacy acknowledgement.

Security/privacy:
- no account required;
- do not expose submissions publicly;
- RLS enabled;
- only authenticated authorised staff can read;
- server-side validation;
- honeypot;
- minimum interaction-time check;
- length constraints;
- email only required if user opts into follow-up;
- no passwords/device serials/sensitive account data requested.

## Internal review

Create a private staff page listing submissions with:
- date;
- participation;
- repair interests;
- volunteer roles;
- venue preference;
- timing;
- contact opt-in;
- notes/ideas.

Do not expose contact data on public pages.

## Accessibility

- semantic headings/labels/fieldset legends;
- keyboard usable;
- large touch targets;
- high contrast;
- no motion dependency;
- responsive tables/cards;
- visible focus;
- plain English;
- no colour-only meaning;
- no account/login barrier.

## Visual direction

Friendly regional community workshop, not corporate IT.

Use:
- warm neutral background;
- deep green/ink text;
- repair-card illustrations made from CSS/simple symbols;
- generous white space;
- compact rounded cards;
- bold, short headings;
- visible CTA;
- repair category chips;
- “project being shaped” badge.

Avoid:
- stock-tech blue;
- recycling-symbol overload;
- dark industrial imagery;
- dense policy text;
- excessive animations;
- carousels.

## Launch state

The page must say:
**“Community idea being tested — no Repair Café event is operating yet.”**

When a date/venue is confirmed later, this can change to event mode.

## Data use

Submissions should support:
- Repair Café demand validation;
- volunteer recruitment;
- venue selection;
- category selection;
- pilot timing;
- Council evidence;
- partner outreach.

## Source documents

- DUBBO-CIRCULAR-ECONOMY-IN-PRACTICE-2026-10-08.md
- DUBBO-REPAIR-CAFE-VENUE-RESEARCH-2026-10-08.md
- REPAIR-CAFE-WEBSITE-ENGAGEMENT-BENCHMARK-2026-10-08.md
- DUBBO-COMPUTER-REPAIR-REUSE-EWASTE-DIRECTORY-2026-10-06.md
- FAMILY-CAPACITY-ITAD-REPAIR-CAFE.md
