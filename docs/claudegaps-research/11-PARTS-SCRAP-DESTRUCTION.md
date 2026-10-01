# 11 — Parts harvesting, scrap grading and drive destruction

**Answers:** `claudeGAPS.md` §11
**Researched:** 2 Oct 2026

---

## Bottom line

1. **A NSW buyer for sorted computer scrap exists with no minimum.** *The Board Guy* (Auburn, Sydney; by appointment) buys PCBs, CPUs, RAM, GPUs and whole units, says **"No minimum or maximum amounts"**, and offers a **"mail in your boards"** option. Prices aren't published (the price page is JavaScript-rendered). **This is a real Stream-C/D exit for Dubbo** that's better than handing boards free to a metal yard. [Primary] https://www.theboardguy.com.au/
2. Bulk buyers such as **Quantum Recycling Solutions** (Carrum Downs, VIC) only buy **sorted** commodities (low/medium/high-grade PCBs, ceramic/fibre CPUs, RAM, cards, cable, copper yokes) and "typically work with bulk quantities". [Primary] https://quantumrecyclingsolutions.com.au/what-we-buy/
3. **Indicative scrap price ladder** (US buyer, USD/lb, *not* AU): laptop motherboards about **US$7.83/lb**, rising to about **US$75.75/lb for clean gold fingers**. This shows the *relative* value of sorting. [Secondary] https://www.boardbuy.com/pricing/scrap
4. **Certified drive destruction for failed-wipe media:** **Shred-X** runs **11 NAID AAA-certified facilities** nationally (NSW: Wetherill Park, Warragamba, Newcastle). It serves **regional NSW** with serial recording and verification under 24-h CCTV before destruction. There's no Dubbo facility, so it's a collection/mail-in arrangement. [Primary] https://www.shred-x.com.au/e-waste/hard-drive-destruction/ ; https://www.shred-x.com.au/location/new-south-wales/

---

## 11.1 Which harvested parts actually sell [Secondary, US-centric; validate with eBay AU sold data]

| Part | Typical used value / demand | Harvest? |
|---|---|---|
| **SSD (NVMe/SATA ≥256 GB)** | "Usually the first prize"; roughly US$50–150 for modern used SSDs | **Yes**, but only **after sanitisation is verified** (repo rule) |
| **RAM** | DDR4 8 GB sticks sell; prices vary (around US$15 for desirable DDR4 desktop sticks). DDR3 is weak | Yes for DDR4/DDR5; DDR3 → scrap (RAM gold fingers) |
| **Working display panel** | "One of the most valuable parts", worth extracting even from a badly damaged laptop | Yes for business models/Macs with intact panels |
| **Keyboard** | Repair shops buy model-specific keyboards; up to around US$50 | Yes for common fleet models |
| **Battery** | Hard to sell; degrades; **lithium transport limits** | **No**, except as internal stock for the same model with ≥80% health |
| **Charger (genuine)** | Steady demand | Yes, and keep as internal stock first |
| Hinges, palmrests, bottom covers | Niche; model-specific | Only for common fleet models (internal stock) |

Sources: https://exittechnologies.com/blog/itad/sell-laptops-for-parts/ ; https://www.makeuseof.com/saved-money-salvaging-parts-from-broken-laptop/ ; https://easytechsolver.com/what-parts-of-an-old-laptop-can-you-sell/

**[Derived] Rule (from 04):** list a part individually only if expected net is ≥ A$25 after fees and postage. Otherwise keep it as **repair stock** for the same model family. That's where most harvested parts earn their value.

## 11.2 Scrap sorting grades (to get paid rather than giving it away)

Common industry categories (from buyer lists and eWaste Ben videos; see 06 A2–A4):
- **High-grade boards:** older server/desktop motherboards with gold-plated components; telecom boards.
- **Medium-grade boards:** modern desktop motherboards, **laptop motherboards**.
- **Low-grade boards:** TV/monitor/power-supply boards, printer boards.
- **CPUs:** ceramic (higher value) vs fibre/organic. Gold-cap/pin types.
- **RAM sticks** (gold fingers), **graphics/PCI cards** (gold fingers), **hard-drive boards**.
- **Cable/wire** (copper; AMR buys copper; see repo BACKLOG-17-20).
- **Steel cases/aluminium:** AMR metal stream.
- **Plastics, glass, batteries:** cost centres via NTCRS/B-cycle routes (repo).

**[Derived] Phase 0:** keep **three bins only**: (1) boards (all grades together until there's volume), (2) CPUs + RAM, (3) copper cable. Post boards/CPUs/RAM to a no-minimum buyer once a full A4 box accumulates; send metal to AMR. Record weight and payout in the tracker (`recycling_rebate`).

**[Open — CALL]:** The Board Guy: current price per kg for laptop boards, mixed RAM and fibre CPUs; whether a posted 5–10 kg box from Dubbo is worth it after postage.

## 11.3 Drive destruction options for media that fails sanitisation

| Option | Assurance | Cost | Notes |
|---|---|---|---|
| **Shred-X** (NAID AAA, 11 facilities, regional NSW service) | High: serial recording + verification + certificate | Quote | Batch failed drives securely and send quarterly |
| Fliptech / ITC / other ITADs | High (certificates) | Quote | Can be bundled with ITAD relationships (see 09) |
| **Local physical destruction** (drill through platters/controller, or crush; NAND chips broken) | Medium: no independent certificate | ~$0 | Acceptable for household devices if photographed and recorded per serial. **Not** acceptable for B2B clients who need certified destruction |

Repo rule stands: **never sell media that failed verification**. Retain it securely until destroyed.

## Sources
- The Board Guy: https://www.theboardguy.com.au/
- Quantum Recycling Solutions: https://quantumrecyclingsolutions.com.au/what-we-buy/
- BoardBuy scrap pricing (US): https://www.boardbuy.com/pricing/scrap
- Shred-X: https://www.shred-x.com.au/e-waste/hard-drive-destruction/ ; https://www.shred-x.com.au/location/new-south-wales/ ; https://www.shred-x.com.au/data-destruction/
- Parts value: https://exittechnologies.com/blog/itad/sell-laptops-for-parts/ ; https://www.makeuseof.com/saved-money-salvaging-parts-from-broken-laptop/
