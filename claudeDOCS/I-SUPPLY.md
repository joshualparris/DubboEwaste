# I. Supply — questions 52–54

**Researched:** 2 Oct 2026  
**Method:** ABS, school-sector sources and current StatCounter Australia data were preferred.

## 52. How many businesses are in Dubbo by industry and size (ABS counts)?

**Status: 🟡 Partly answered — the latest detailed LGA cube currently available is the 2025 release; the 2026 detailed LGA cubes are due in December 2026.**

The ABS **Counts of Australian Businesses** series provides exactly the needed LGA-by-industry and employment-size data in Data Cube 10. At the time of this research:
- the August 2026 release gives national headline counts to 30 June 2026;
- the detailed geographic cubes for the 2026 release are scheduled for **18 Dec 2026**;
- the latest published detailed LGA cube is therefore the **30 June 2025** release.

Primary source:
- https://www.abs.gov.au/statistics/economy/business-indicators/counts-australian-businesses-including-entries-and-exits/latest-release

The current web interface did not expose the Dubbo Regional row from the 2025 XLSX directly in this research environment, so I am not inventing a 2025 total.

Useful historical ABS-derived benchmarks that are publicly indexed:
- **2020:** 5,183 registered businesses in Dubbo Regional LGA.
  - 3,222 non-employing (62.2%)
  - 1,836 employing fewer than 20 (35.4%)
  - 118 employing 20–199 (2.3%)
  - Agriculture, Forestry & Fishing: 21.6%
  - Construction: 18.3%
- **2021:** another ABS-derived planning table gives 5,142 total:
  - 3,006 non-employing
  - 2,013 with 1–19 employees
  - 121 with 20–199
  - 3 with 200+.

Sources reproducing ABS tables:
- https://majorprojects.planningportal.nsw.gov.au/prweb/PRRestService/mp/01/getContent?AttachRef=PDA-39297561%2120220413T095629.478+GMT
- https://ampyr.com.au/assets/uploads/sites/23/2026/02/Appendix-O-Social-Impact-Assessment.pdf

**What remains:** download ABS Data Cube 10 for the 2025 release in a normal browser/desktop session and extract LGA code **12390 Dubbo Regional** by industry and employment-size band. Then repeat after the 2026 geographic cubes release on 18 Dec 2026.

**DubboEwaste implication:** even the older ABS data shows a market of roughly five thousand local businesses, overwhelmingly non-employing or small employers. That supports designing collection and onboarding for very small businesses rather than only enterprise fleets.

---

## 53. Which independent schools are in Dubbo, and how do they handle ICT and disposal?

**Status: ✅🟡 Schools identified; ICT use partly visible; disposal practices are generally not public.**

A current school-sector dataset for Dubbo Regional identifies **5 independent schools** serving the LGA. Public school listings and sector membership sources identify the relevant schools as:

1. **Dubbo Christian School** — Dubbo
2. **Macquarie Anglican Grammar School** — Dubbo
3. **Central West Leadership Academy** — Dubbo
4. **Burrabadine / Cornerstone Christian School** — Dubbo area
5. **Wellington Christian School** — Wellington / Dubbo Regional LGA

Supporting sources:
- https://cis.nsw.edu.au/schools/
- https://www.isnsw.edu.au/wp-content/uploads/Independent-Schools-NSW-2024-annual-report.pdf
- https://censusatlas.au/region/lga/LGA12390/dubbo-regional/topic/education

### Public ICT evidence

**Dubbo Christian School**
- publicly advertises an ICT Systems Administrator role for 2027, confirming an internal ICT function;
- an older Viatek case study documents managed printing/PaperCut and multiple networked multifunction/desktop print devices across DCS/Wellington.

Sources:
- https://www.dubbocs.edu.au/employment/
- https://viatek.com.au/?case-studies=dubbo-christian-school

**Central West Leadership Academy**
- explicitly says technology is embedded across the curriculum;
- students have their own Chromebooks and access online virtual classrooms;
- its fee/enrolment information says students are required to purchase a Chromebook.

Sources:
- https://theacademy.nsw.edu.au/
- https://theacademy.nsw.edu.au/about

**Macquarie Anglican Grammar School**
- public material confirms the independent P–12 school and its current organisational structure, but I did not find a public IT asset-disposal policy.

Source:
- https://www.mags.nsw.edu.au/about-us/

**Wellington Christian School**
- current employment material references computer software/adaptive technologies and information-technology skills;
- third-party school profiles list an ICT Technician role.
- No public disposal policy was found.

Source:
- https://wellingtoncs.com.au/

**Burrabadine / Cornerstone**
- public ABR history confirms the school/business identity and its connection to Cornerstone Community;
- no public ICT disposal process was found.

Source:
- https://abr.business.gov.au/ABN/View?id=49066809612

### Disposal finding
I found **no public ICT/e-waste disposal or device-retirement policy** for these schools that establishes:
- their current e-waste contractor;
- refresh cycle;
- data-erasure process;
- whether old devices are sold, donated, returned to a reseller or recycled.

**DubboEwaste takeaway:** the independent-school segment is real and locally concentrated, but disposal is a direct-outreach research question rather than something the schools publish. A useful pitch would be secure local collection + serialised reporting + reuse-first triage + data-erasure evidence.

---

## 54. What share of Australian PCs still run Windows 10?

**Status: ✅ Answered with current StatCounter browser-usage data.**

StatCounter's **Australia desktop Windows-version** data for **September 2026** shows:

| Windows version | Share of Windows desktop usage |
|---|---:|
| Windows 11 | **80.49%** |
| Windows 10 | **18.60%** |
| Windows 7 | 0.82% |
| Windows 8.1 | 0.03% |
| Windows Vista | 0.03% |
| Windows XP | 0.01% |

Primary data page:
- https://gs.statcounter.com/windows-version-market-share/desktop/australia

For context, Windows itself accounts for **64.83% of Australian desktop OS browser usage** in September 2026.

Source:
- https://gs.statcounter.com/os-market-share/desktop/australia

This is **browser-usage market share**, not an installed-base census. It should not be interpreted as “18.6% of every physical Australian PC”, but it is a good current indicator of active Windows usage.

The Windows 10 share has been falling:
- March 2026: ~20.79%
- June 2026: ~21.17% in StatCounter's indexed monthly result
- September 2026: **18.60%**

**DubboEwaste implication:** a substantial minority of active Windows desktops are still on Windows 10 almost a year after standard Windows 10 support ended. This supports continued supply of Win10-era fleet hardware into the secondary/disposal market, while making Windows 11 eligibility a valuable triage field.
