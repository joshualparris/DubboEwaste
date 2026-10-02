#!/usr/bin/env python3
import concurrent.futures, pathlib, re, sys, urllib.request, urllib.error, json
from collections import defaultdict

ROOT=pathlib.Path(".")
FILES=[p for p in ROOT.rglob("*") if p.is_file() and p.suffix.lower() in {".md",".csv",".txt",".yml",".yaml"} and ".git" not in p.parts]
pat=re.compile(r'https?://[^\s<>"\')\]}]+')
refs=defaultdict(set)
for p in FILES:
    try: text=p.read_text(encoding="utf-8",errors="ignore")
    except Exception: continue
    for u in pat.findall(text):
        u=u.rstrip(".,;:")
        refs[u].add(str(p))

def check(url):
    headers={"User-Agent":"Mozilla/5.0 DubboEwaste-LinkAudit/1.0"}
    req=urllib.request.Request(url,headers=headers,method="HEAD")
    try:
        with urllib.request.urlopen(req,timeout=12) as r:
            return url,r.status,r.geturl(),"ok"
    except urllib.error.HTTPError as e:
        if e.code in (401,403,405,429):
            # Retry with a tiny GET for sites that reject HEAD.
            try:
                req=urllib.request.Request(url,headers={**headers,"Range":"bytes=0-1024"},method="GET")
                with urllib.request.urlopen(req,timeout=12) as r:
                    return url,r.status,r.geturl(),"ok-get"
            except urllib.error.HTTPError as e2:
                cls="blocked" if e2.code in (401,403,429) else "dead" if e2.code in (404,410) else "error"
                return url,e2.code,getattr(e2,"url",url),cls
            except Exception as e2:
                return url,None,url,"network-error"
        return url,e.code,getattr(e,"url",url),"dead" if e.code in (404,410) else "error"
    except Exception:
        return url,None,url,"network-error"

urls=sorted(refs)
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
    for row in ex.map(check,urls):
        results.append(row)

counts=defaultdict(int)
lines=["# External Link Audit","",f"Scanned {len(FILES)} text files and {len(urls)} unique external URLs.","","| Status | HTTP | URL | Final URL | Referenced by |","|---|---:|---|---|---|"]
for url,status,final,cls in results:
    counts[cls]+=1
    fs="<br>".join(sorted(refs[url])[:8])
    lines.append(f"| {cls} | {status or ''} | {url} | {final if final!=url else ''} | {fs} |")
pathlib.Path("link-audit.md").write_text("\n".join(lines),encoding="utf-8")
pathlib.Path("link-audit.json").write_text(json.dumps({"counts":counts,"results":results},indent=2,default=dict),encoding="utf-8")
print("files",len(FILES),"urls",len(urls),"counts",dict(counts))
bad=[r for r in results if r[3]=="dead"]
print("dead",len(bad))
for r in bad[:100]: print("DEAD",r[1],r[0])
# Do not fail on bot-blocked/network errors; fail only on explicit 404/410.
sys.exit(1 if bad else 0)
