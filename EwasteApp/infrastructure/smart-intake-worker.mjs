// Cloudflare Workers AI binding: AI; secret_text binding: INTAKE_SECRET. Never commit the secret.
export default {async fetch(req,env){
const headers={"Cache-Control":"no-store","Content-Type":"application/json"};
const out=(v,status=200)=>new Response(JSON.stringify(v),{status,headers});
if(req.method!=="POST"||!env.INTAKE_SECRET||req.headers.get("Authorization")!=="Bearer "+env.INTAKE_SECRET)return out({error:"Unauthorized"},401);
let raw;try{const length=Number(req.headers.get("content-length")||0);if(length>3200000)return out({error:"Too large"},413);const body=await req.text();if(body.length>3200000)return out({error:"Too large"},413);raw=JSON.parse(body);}catch{return out({error:"Bad JSON"},400);}
if(typeof raw.prompt!=="string"||raw.prompt.length>6000||typeof raw.description!=="string"||raw.description.length>4500||(!raw.image&&!raw.description))return out({error:"Invalid input"},400);
if(raw.image&&(typeof raw.image!=="string"||raw.image.length>3000000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(raw.image)))return out({error:"Invalid image"},400);
try{const content=[{type:"text",text:raw.description||"Identify visible equipment."}];if(raw.image)content.push({type:"image_url",image_url:{url:raw.image}});
const result=await env.AI.run("@cf/mistralai/mistral-small-3.1-24b-instruct",{messages:[{role:"system",content:raw.prompt},{role:"user",content}],temperature:0.1,max_tokens:5000});
const answer=result.choices?.[0]?.message?.content||result.response;
if(typeof answer!=="string")return out({error:"Invalid AI result"},502);
return out({answer});
}catch(e){return out({error:"Workers AI inference failed"},502);}
}};