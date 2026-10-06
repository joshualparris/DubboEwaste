# Field Validation System — closing the ten remaining Dubbo unknowns

**Created:** 6 October 2026

The private AssetFlow page is **/validation**. It stores official responses, interview results, Repair Café demand observations, private commercial terms and real per-asset pilot economics in Supabase behind staff authentication/RLS.

Do **not** put private emails, quotes, contact details or customer-specific evidence into this public repository.

## 1. AMR Dubbo downstream

Australian Metal Recycling currently advertises the Dubbo yard at **34 Mountbatten Drive** and accepts computers/laptops, monitors, smartphones/tablets and printers/scanners as e-waste. Public AMR material still does **not** name the first downstream e-waste processor/facility used for the Dubbo load.

Sources:
- https://australianmetalrecycling.com.au/
- https://australianmetalrecycling.com.au/contact/
- https://australianmetalrecycling.com.au/drop-off/

Ask AMR for the current downstream legal entity/facility, a redacted certificate/dispatch docket, NTCRS/co-regulatory arrangement if applicable, reuse-before-recycling process, minimum quantities and embedded-battery rules.

Use [../templates/amr-downstream-evidence-request.md](../templates/amr-downstream-evidence-request.md).

## 2. Dubbo Regional Council post-2025 arrangement

Council's current **GIPA Register of Contracts**, updated **28 September 2026**, covers contracts worth or likely to be worth **$150,000+ GST inclusive**. No current e-waste contract appears in the register.

That does **not** prove there is no current arrangement. It may be below the threshold, bundled into another arrangement or delivered through a smaller RFQ/purchase order/stewardship arrangement.

Current register:
https://www.dubbo.nsw.gov.au/ArticleDocuments/243/GIPA%20Contract%20Register%2028.9.26.pdf.aspx

Council's adopted Waste Strategy recorded the former Matthews Metals e-waste contract as expiring 30 June 2025:
https://www.dubbo.nsw.gov.au/ArticleDocuments/242/Waste_Strategy_2025_Adopted.pdf.aspx

Council continues to advertise free domestic e-waste drop-off:
- https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/council-waste-facilities
- https://www.dubbo.nsw.gov.au/Households-Residents/Rubbish-Recycling-and-Sustainability/village-and-rural-waste-depots

### Historical local volume evidence
Council reported:
- 2016–17: 13 t
- 2017–18: 13 t
- 2018–19: 2.3 t
- 2019–20: 5.4 t
- 2020–21: 16.08 t
- 2022–23: 18 t e-waste sent off site.

The 2024–25 annual report reports 2,579 tonnes of recycled material overall but does not publicly break out e-waste in the headline figure.

Sources:
- https://www.dubbo.nsw.gov.au/ArticleDocuments/10544/Annual%20Report%202021%20State%20of%20the%20environment.pdf.aspx
- https://www.dubbo.nsw.gov.au/ArticleDocuments/10544/Annual%20Report%202022%202023_Print.pdf.aspx
- https://www.dubbo.nsw.gov.au/ArticleDocuments/11102/Annual_Report_2025_Endorsed.pdf.aspx

Council expressly offers informal access first, then formal GIPA if required:
https://www.dubbo.nsw.gov.au/about-council/meetings-and-documents/access-to-information

Use [../templates/drc-ewaste-information-request.md](../templates/drc-ewaste-information-request.md).

## 3. NSW Education dedicated vendor

The Department still publicly refers to **the vendor** without naming it. Its 2025 Technology 4 Learning update says schools use a formalised eWaste process and the Department was working with the vendor to clear a backlog.

Source:
https://education.nsw.gov.au/teaching-and-learning/technology-for-learning/news-t4l/2025/issue122

Operational contact published on that page:
**COR0835R8406.SchoolsInfra@det.nsw.edu.au**

Right to Access:
**GIPA@det.nsw.edu.au**
https://education.nsw.gov.au/rights-and-accountability/information-access

Request records identifying the vendor, contract reference, regional collector, aggregate Dubbo/Western NSW collection volume, blank/redacted sanitisation certificate and Settlement Report, and any recorded outcome split between reuse/resale/parts/recycling/destruction.

Use [../templates/nsw-education-ewaste-records-request.md](../templates/nsw-education-ewaste-records-request.md).

## 4. What named institutions actually do

Use a standard interview, and public-information requests for public bodies.

**TAFE NSW:** GIPA@tafensw.edu.au  
https://www.tafensw.edu.au/about/policies-and-procedures/how-to-access-tafe-nsw-information

**Western NSW Local Health District:** WNSWLHD-GIPA@health.nsw.gov.au  
https://www.health.nsw.gov.au/gipaa/Pages/table-of-contacts.aspx

Current NSW Health policy says externally disposed hardware must use an **approved third-party provider** and be accompanied by a **certificate of destruction**:
https://www1.health.nsw.gov.au/pds/ActivePDSDocuments/PD2026_001.pdf

**Charles Sturt University:** informationintegrity@csu.edu.au  
https://www.csu.edu.au/division/vcoffice/ogca/right-to-information  
https://www.csu.edu.au/division/vcoffice/ogca/university-ombudsman/contract-register

Use [../templates/institution-device-disposal-interview.md](../templates/institution-device-disposal-interview.md) for private/non-government organisations, and [../templates/public-institution-it-disposal-information-request.md](../templates/public-institution-it-disposal-information-request.md) for TAFE NSW, WNSWLHD/eHealth NSW and Charles Sturt University.

## 5. Actual local volumes

Build three evidence layers:

1. **Council waste stream:** e-waste tonnes by facility/year, household vs other if recorded.
2. **Institutional retirement:** fleet size, refresh cycle, annual retired devices, last batch.
3. **Repair demand:** unique enquiry, device type, fault, affordability barrier, attendance and outcome.

Record private results in AssetFlow /validation.

## 6. Actual local economics

The new pilot economics record captures:
- acquisition;
- collection freight;
- parts;
- downstream;
- marketplace fees;
- outbound freight;
- returns;
- other cash costs;
- intake/diagnostic/sanitisation/repair/listing minutes;
- realised revenue;
- final route.

After 20–30 devices calculate contribution after labour using a chosen labour rate. Do not substitute industry-average margins for measured Dubbo data.

## 7. Council / Fair Trading / insurer approval

Track final written responses under **APPROVALS**. Use [../templates/phase-0-approval-request-pack.md](../templates/phase-0-approval-request-pack.md) for the Council planning, NSW Fair Trading and insurer/broker enquiries.

Close separately:
- Council planning/home-workshop/public visits/storage/batteries;
- NSW Fair Trading dealer/exemption/holding/wiping questions;
- insurer acceptance for home electronics refurbishment, customer property, lithium, public visits, product liability and data work.

## 8. Will organisations actually supply devices?

An organisation becomes evidence of supply only after a real response records:
- authority;
- current route/provider;
- batch size/timing;
- data requirements;
- cost/rebate;
- willingness YES/MAYBE/NO;
- conditions;
- likely trial units.

The validation dashboard counts trial willingness.

## 9. Will residents use a Repair Café?

Use a privacy-minimised survey: no names, phones or street addresses needed for demand validation.

Use [../templates/repair-cafe-demand-survey.md](../templates/repair-cafe-demand-survey.md).

## 10. Private/commercial terms

Use one repeatable RFQ for processors, ITAD partners, erasure providers, insurers/brokers and other quote-only services.

Use [../templates/commercial-terms-rfq.md](../templates/commercial-terms-rfq.md).

## Recommended sequence

1. Council informal request for post-2025 arrangement + 2023–26 weights.
2. AMR downstream evidence request.
3. NSW Education operational request, then narrow GIPA if necessary.
4. TAFE / WNSWLHD / CSU informal information requests.
5. Ten organisation interviews.
6. 20–30 anonymous Repair Café demand observations.
7. At least two downstream and two insurance/broker responses.
8. First 20–30 device pilot with complete economics.

At that point most remaining uncertainty becomes measured Dubbo evidence rather than theory.
