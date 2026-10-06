# 01 — Dubbo/Orana repair and refurbished-computer market size

**Questions answered:** 1–4  
**Research date:** 6 October 2026

## 1. How many Dubbo Regional adults plausibly use laptops/desktops?

### Hard local denominator

The 2021 Census records **54,922 people** in Dubbo Regional LGA and **22,693 private dwellings**. Occupied household types total roughly **19,273 households** (13,367 family + 5,256 lone-person + 650 group households).

Age counts are unusually useful here. Dubbo Regional had:

- 0–4: 3,888
- 5–9: 3,825
- 10–14: 3,799
- 15–19: 3,148

If the 15–19 band is approximately even by year, the 18+ population is about **41,500**. This interpolation is a planning estimate, not an ABS published adult total.

ABS source:
https://www.abs.gov.au/census/find-census-data/quickstats/2021/LGA12390

### National/regional device-use evidence

ACMA's 2025 survey found:

- 99.7% of Australian adults used at least one device to go online in the prior 6 months;
- adults used an average **4.1 device types**;
- **73% used a laptop** to access the internet.

In 2024, when ACMA published a regional/metropolitan split, **67% of regional adults used a laptop** compared with 73% metropolitan.

Sources:
- https://www.acma.gov.au/publications/2026-02/report/communications-and-media-australia-how-we-use-internet
- https://www.acma.gov.au/sites/default/files/2026-02/How%20we%20use%20the%20internet%20-%20Executive%20summary%20and%20key%20findings.pdf

### Defensible planning range

Applying 67–73% to the approximate 18+ LGA population yields roughly:

- **27,800 adult laptop users** at 67%;
- **30,300 adult laptop users** at 73%.

That is the best defensible current planning range found.

**It is not a count of owned laptops.** It includes personal and employer-provided devices, multiple people can share a machine, and some people use multiple laptops.

Desktop users overlap with laptop users, so desktop rates must not simply be added.

## 2. What is the plausible organisational endpoint base?

There is no public Dubbo endpoint census.

Useful hard denominators are:

- **5,593 active businesses** currently shown by Your Council NSW for Dubbo Regional;
- about **26,650 jobs** supported by the local economy;
- 2021 Census occupation mix includes:
  - professionals 4,648;
  - clerical/admin 3,158;
  - managers 3,133.

Those three obviously computer-intensive occupation groups alone total about **10,900 workers**, before counting computer-using staff in health, education, retail, government, sales, technicians and others.

Sources:
- https://www.yourcouncil.nsw.gov.au/council-data/dubbo-regional-1787123466/
- https://www.dubbo.nsw.gov.au/Business-Investors/Economic-development/regional-economic-development
- ABS Census QuickStats above.

### What we can and cannot infer

It is reasonable to infer a **five-figure organisational endpoint estate** across the LGA.

It is not defensible to claim an exact number such as “15,000 business laptops” without fleet records.

The existing SME and school research should be used for named prospect-level estimates; this report supplies the market denominator only.

## 3. What annual replacement/failure volume is defensible?

### Replacement

No current public dataset was found for Dubbo-specific laptop refresh frequency.

Instead of inventing a refresh rate, use sensitivity bands against the 27.8k–30.3k adult-laptop-user range:

| Assumed effective refresh/replacement interval | Annual replacement-equivalent events |
|---|---:|
| 3 years | ~9,300–10,100 |
| 4 years | ~7,000–7,600 |
| 5 years | ~5,600–6,100 |
| 6 years | ~4,600–5,100 |

These are **scenario calculations**, not forecasts. Employer-owned machines, shared machines and multiple-device owners mean a user count is not a device count.

### Failure/repair

No recent high-quality Australian dataset was found that supports a single annual laptop failure percentage for Dubbo.

Do not reuse old SquareTrade-era hardware-failure percentages as current fact.

For capacity planning only, the following sensitivity table is honest:

| Share of adult laptop users experiencing a repair/service-worthy issue in a year | Events |
|---|---:|
| 5% | ~1,400–1,500 |
| 10% | ~2,800–3,000 |
| 15% | ~4,200–4,500 |

The pilot should replace these assumptions with observed enquiries and jobs.

## 4. What is the addressable low-cost repair/refurbishment market?

The Australian Digital Inclusion Index 2025 strengthens the affordability case:

- **20.6%** of Australians are excluded/highly excluded;
- **9.2%** are highly excluded;
- outside capital cities, the largest gaps are Digital Ability (**7.8 points**) and Affordability (**5.3 points**);
- exclusion is particularly high among people aged 75+, public-housing residents and First Nations people.

Source:
https://digitalinclusionindex.org.au/the-2025-findings/

Dubbo Regional itself has a young population, a large regional catchment and 19k+ occupied households. That supports a plausible low-cost service need, but **digital exclusion does not equal demand for hardware repair**.

### Practical addressable-market scenarios

A deliberately conservative first-year planning exercise:

- if only **1%** of the 27.8k–30.3k adult laptop-user base uses a low-cost/refurb/repair offer annually: ~278–303 people;
- at **2%**: ~556–606;
- at **3%**: ~835–909.

A fortnightly ITAD operation plus monthly Repair Café could not service all of that anyway. The important point is that the market does not need a high penetration rate to fill a small pilot.

## Recommended validation experiment

For 12 weeks, count separately:

1. unique Repair Café enquiries;
2. booked and attended repairs;
3. fault categories;
4. “commercial repair unaffordable” self-report;
5. successfully repaired;
6. referred to commercial repairer;
7. replacement/refurb purchase requested;
8. suburb/postcode only (not full address);
9. acquisition source (“heard via Council/library/Facebook/etc”);
10. labour minutes.

For refurbished sales, record views/enquiries/sales and postcode for only the minimum privacy-safe geographic evidence.

### Decision threshold

Do not ask “is the Dubbo market 30,000 people?”

Ask:

> Can a bounded service reliably attract 10–20 suitable repair/reuse transactions per month without paid mass marketing and without consuming more family/operator capacity than planned?

That is a decision the pilot can actually answer.
