import {parseDrafts,prompt} from "./smart-intake";
export async function analyseEquipment(image:string|undefined,description:string){
  const secret=process.env.SMART_INTAKE_WORKER_SECRET;
  const url=process.env.SMART_INTAKE_WORKER_URL;
  if(!secret||url!=="https://assetflow-intake-vision.parris-neathaustralia.workers.dev")throw Error("Smart Intake AI provider configuration missing.");
  let response:Response;
  try{response=await fetch(url,{method:"POST",headers:{Authorization:"Bearer "+secret,"Content-Type":"application/json"},body:JSON.stringify({prompt,image,description}),signal:AbortSignal.timeout(45000),cache:"no-store"});}
  catch{throw Error("Smart Intake AI connection timed out or is unavailable.");}
  if(!response.ok)throw Error("Smart Intake AI provider rejected the request ("+response.status+").");
  try{const data=await response.json();return parseDrafts(data.answer);}
  catch{throw Error("AI returned an invalid inventory. Take a clearer photo and retry.");}
}
