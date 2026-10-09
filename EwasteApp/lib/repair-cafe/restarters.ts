import "server-only";
export type WikiHit={title:string;url:string;snippet:string};
export async function searchRestarters(q:string):Promise<{hits:WikiHit[];available:boolean}>{
 if(q.trim().length<2)return {hits:[],available:true};
 const params=new URLSearchParams({action:"query",list:"search",srsearch:q.slice(0,100),srlimit:"8",format:"json",formatversion:"2"});
 try{
  const r=await fetch("https://wiki.restarters.net/w/api.php?"+params,{next:{revalidate:3600},signal:AbortSignal.timeout(4000)});
  if(!r.ok)throw Error("upstream unavailable");
  const body=await r.json() as {query?:{search?:{title:string;snippet?:string}[]}};
  return {available:true,hits:(body.query?.search??[]).slice(0,8).map(x=>({
   title:x.title,url:"https://wiki.restarters.net/wiki/"+encodeURIComponent(x.title.replaceAll(" ","_")),
   snippet:(x.snippet??"").replace(/<[^>]*>/g,"").slice(0,240)
  }))};
 }catch{return {available:false,hits:[]};}
}
