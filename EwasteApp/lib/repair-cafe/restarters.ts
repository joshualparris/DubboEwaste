import "server-only";
export type WikiHit={title:string;url:string;snippet:string};
export async function searchRestarters(q:string):Promise<{hits:WikiHit[];available:boolean}>{
 if(q.trim().length<2)return {hits:[],available:true};
 const params=new URLSearchParams({action:"query",list:"search",srsearch:q.slice(0,100),srlimit:"8",format:"json",formatversion:"2"});
 for(const endpoint of ["https://wiki.restarters.net/api.php","https://wiki.restarters.net/w/api.php"]){
  try{
   const r=await fetch(endpoint+"?"+params,{next:{revalidate:3600},signal:AbortSignal.timeout(3500)});
   if(!r.ok)continue;
   const body=await r.json() as {query?:{search?:{title:string;snippet?:string}[]}};
   if(!body.query?.search)continue;
   return {available:true,hits:body.query.search.slice(0,8).map(x=>({
    title:x.title,url:"https://wiki.restarters.net/index.php?title="+encodeURIComponent(x.title.replaceAll(" ","_")),
    snippet:(x.snippet??"").replace(/<[^>]*>/g,"").slice(0,240)
   }))};
  }catch{continue;}
 }
 return {available:false,hits:[]};
}
