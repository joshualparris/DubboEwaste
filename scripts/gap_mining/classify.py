"""Map mined gap lines to work packages. Usage: classify.py IN.csv OUT.csv WP.json"""
import csv,re,sys,json
from collections import Counter,defaultdict
WP=[ # id, name, regex
("WP01","Premises, planning and property",r"(?i)\b(planning|zoning|LEP|DCP|home business|home industry|exempt development|lease|landlord|premises|shed|DA\b|development application|council planning)"),
("WP02","Legal entity, second-hand dealing, tax",r"(?i)(second-hand|secondhand|pawnbroker|fair trading|dealer|14-day|ABN|GST|division 66|margin scheme|tax|sole trader|incorporat|charity|ACNC|DGR|business name)"),
("WP03","Insurance and liability",r"(?i)(insur|liabilit|indemnit|broker|underwrit|waiver)"),
("WP04","Council, Whylandra and regional waste flow",r"(?i)(whylandra|council|netwaste|GIPA|tonnage|contractor|bulky|CRC|community recycling|resource recovery park|reuse shop)"),
("WP05","Downstream recyclers and stewardship schemes",r"(?i)(downstream|AMR|matthews|ecocycle|ecobatt|sircel|techcollect|ANZRP|NTCRS|co-regulat|mobilemuster|b-cycle|bcycle|recycler|AS ?/?NZS ?5377|R2v3|e-stewards|scrap|shred)"),
("WP06","Supply, institutional disposal and procurement",r"(?i)(school|education|TAFE|hospital|health|LHD|MSP|procurement|tender|contract 9826|device bank|good360|donor|sourcing|prospect|fleet|refresh|auction|grays|government devices|SME)"),
("WP07","Data sanitisation, locks and ownership",r"(?i)(wipe|erasure|sanitis|blancco|nwipe|NIST|800-88|ISM|data|FRP|activation lock|icloud|MDM|autopilot|intune|bios password|computrace|absolute|knox|lock|title|ownership|stolen|IMEI)"),
("WP08","Battery, electrical safety and WHS",r"(?i)(battery|lithium|li-ion|swollen|fire|safework|electrical|test and tag|test-and-tag|RCM|EESS|AS/NZS 3760|3760|5761|5762|WHS|dangerous goods|PPE|ventilat)"),
("WP09","Triage, repair, testing, parts and skills",r"(?i)(triage|diagnos|repair|parts|schematic|board|bench|grade|grading|windows 1[01]|ESU|chromeos|linux|macos|ios|android|support end|course|certificat|competenc|training|UEE|iFixit|learning)"),
("WP10","Market, pricing, economics and capacity",r"(?i)(price|pricing|eBay|marketplace|gumtree|sell|sale|resale|margin|cost|revenue|economics|labour|hours|capacity|demand|buyer|warranty|return|channel|freight|courier)"),
("WP11","Repair Café, digital inclusion and community",r"(?i)(repair caf|volunteer|venue|digital inclusion|recipient|community|men'?s shed|library of things|op shop|charity|good things|reconnect|ponyup)"),
("WP12","Policy, funding, circular economy and impact",r"(?i)(grant|fund|policy|productivity commission|right to repair|stewardship|circular|emission|LCA|impact|carbon|EPA|regulation 2026|product lifecycle)"),
("WP13","Governance, records, software and research integrity",r"(?i)(assetflow|software|app|supabase|record|audit|repo|document|evidence|register|backup|privacy policy|retention|AI|research)"),
]
rows=list(csv.DictReader(open(sys.argv[1],encoding='utf-8')))
assign=defaultdict(list); cnt=Counter(); multi=0
for r in rows:
    hits=[w for w in WP if re.search(w[2],r['text'])]
    if not hits: hits=[("WP13",)+WP[12][1:]] if False else [("WP00","Unclassified / general","")]
    r['work_packages']=';'.join(h[0] for h in hits)
    r['primary_wp']=hits[0][0]
    for h in hits: cnt[h[0]]+=1
    if len(hits)>1: multi+=1
w=csv.DictWriter(open(sys.argv[2],'w',newline='',encoding='utf-8'),fieldnames=['repo','file','line','primary_wp','work_packages','text'])
w.writeheader(); [w.writerow(r) for r in rows]
print(len(rows),'lines; multi-WP',multi)
for k,v in sorted(cnt.items()): print(k,v)
json.dump({w[0]:w[1] for w in WP},open(sys.argv[3],'w'),indent=1)
