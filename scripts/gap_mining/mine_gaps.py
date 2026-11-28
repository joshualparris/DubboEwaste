"""Mine open-gap lines from the research repos (28 Nov 2026 master gap v2)."""
import os,re,sys,csv,json,hashlib
# Usage: python3 mine_gaps.py OUT.csv [PARENT_DIR]
# PARENT_DIR holds sibling clones named dubboewaste, circulareconomydubbo, researchatlas, researchlibrary.
_P=sys.argv[2] if len(sys.argv)>2 else os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','..'))
ROOTS={'DubboEwaste':os.path.join(_P,'dubboewaste'),'CircularEconomyDubbo':os.path.join(_P,'circulareconomydubbo'),'ResearchAtlas':os.path.join(_P,'researchatlas'),'ResearchLibrary':os.path.join(_P,'researchlibrary')}
ROOTS={k:v for k,v in ROOTS.items() if os.path.isdir(v)}
SKIP_DIRS={'.git','node_modules','analytics','.next','public','src','app','components','lib','supabase','scripts','tests','EwasteApp','DubboEwasteApp','vercel-disabled-ewaste','website','android-reuse-app','reuse-os','tools','notebooklm','OpenSourceSoftware','examples','usb-inventory','cross-river-explorer','companion','000-Computer-Science','700-Arts-Recreation','tabletop','telecommunications','rfs'}
KEEP_EXT=('.md','.csv','.txt','.yaml')
PAT=re.compile(r"\b(OPEN|UNKNOWN|unknown|unverified|UNVERIFIED|unresolved|not (?:yet )?(?:verified|established|confirmed|found|known|public|proven|measured|tested|answered)|no public|TBD|TODO|to be confirmed|needs? (?:to )?(?:confirm|verif|check)|still (?:requires?|needs?|open)|remains? (?:open|unknown|unclear|unverified)|gap|Gap|GAP|BLOCKED|HOLD|pending|PENDING|not yet)\b")
# Dubbo e-waste relevance for non-DubboEwaste repos
REL=re.compile(r"(?i)e-?waste|ewaste|itad|refurb|repair|reuse|whylandra|amr|ecocycle|ecobatt|laptop|device|battery|circular|dubbo")
out=[]
for repo,root in ROOTS.items():
    for d,dirs,files in os.walk(root):
        rel=os.path.relpath(d,root)
        dirs[:]=[x for x in dirs if x not in SKIP_DIRS]
        for f in files:
            if not f.endswith(KEEP_EXT): continue
            p=os.path.join(d,f); rp=os.path.relpath(p,root)
            if repo!='DubboEwaste':
                if repo=='ResearchAtlas' and 'internal-research' not in rp and 'docs/research' not in rp: continue
                if repo=='ResearchLibrary' and not f.lower().startswith('readme'): continue
            if rp=='data/evidence.yaml' or rp.startswith('data/ecocycle') or rp.startswith('data/master-gap-v2') or 'MASTER-GAP-RESEARCH-V2' in rp or 'link-audit' in rp: continue
            try: lines=open(p,encoding='utf-8',errors='ignore').read().splitlines()
            except: continue
            for i,l in enumerate(lines,1):
                t=l.strip()
                if len(t)<25 or len(t)>1200: continue
                if not PAT.search(t): continue
                if repo!='DubboEwaste' and not REL.search(t): continue
                out.append((repo,rp,i,t))
# dedupe exact normalised
seen=set(); ded=[]
for r in out:
    k=hashlib.md5(re.sub(r'[^a-z0-9 ]','',r[3].lower())[:200].encode()).hexdigest()
    if k in seen: continue
    seen.add(k); ded.append(r)
w=csv.writer(open(sys.argv[1],'w',newline='',encoding='utf-8'))
w.writerow(['repo','file','line','text'])
for r in ded: w.writerow(r)
from collections import Counter
c=Counter(r[1].split('/')[0] if '/' in r[1] else r[1] for r in ded)
print('raw',len(out),'deduped',len(ded))
fc=Counter((r[0],r[1]) for r in ded)
print('files with gaps',len(fc))
for (repo,f),n in fc.most_common(45): print(n,repo,f)
