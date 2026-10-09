// Encrypted, account-scoped offline operations. No key or phrase is persisted.
// A tab may close without losing pending work. The user must unlock again.
// IndexedDB is not guaranteed in private/incognito mode; display errors in the UI.
export type OfflineKind="check_in"|"queue_notes"|"ticket_update";
export type OfflineStatus="pending"|"conflict"|"blocked";
export type OfflineOperation={
 id:string;owner:string;eventId:string;kind:OfflineKind;payload:Record<string,string|boolean>;
 createdAt:number;status:OfflineStatus;error?:string;
};
type Stored={
 key:string;owner:string;eventId:string;createdAt:number;status:OfflineStatus;
 error:string;iv:number[];cipher:ArrayBuffer;
};
type Workspace={key:string;salt:number[];iv:number[];check:ArrayBuffer;eventId?:string};
const databaseName="repair-cafe-offline-encrypted-v1";
const VERSION=2;
function tx<T>(request:IDBRequest<T>):Promise<T>{
 return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
}
export function openOfflineDB():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  if(!("indexedDB" in window)||!window.crypto?.subtle){reject(Error("Encrypted offline storage is not available in this browser"));return}
  const r=indexedDB.open(databaseName,VERSION);
  r.onupgradeneeded=()=>{
   const d=r.result;
   if(!d.objectStoreNames.contains("operations"))d.createObjectStore("operations",{keyPath:"key"});
   if(!d.objectStoreNames.contains("workspaces"))d.createObjectStore("workspaces",{keyPath:"key"});
   if(!d.objectStoreNames.contains("snapshots"))d.createObjectStore("snapshots",{keyPath:"key"});
  };
  r.onerror=()=>reject(r.error);r.onsuccess=()=>resolve(r.result);
  r.onblocked=()=>reject(Error("Close the other Repair Café tab so offline storage can open"));
 });
}
const bytes=(size:number)=>Array.from(crypto.getRandomValues(new Uint8Array(size)));
async function derive(phrase:string,salt:number[]):Promise<CryptoKey>{
 const raw=await crypto.subtle.importKey("raw",new TextEncoder().encode(phrase),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt:new Uint8Array(salt),
   iterations:220000,hash:"SHA-256"},raw,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}
async function encrypt(key:CryptoKey,value:unknown){
 const iv=bytes(12);
 const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv:new Uint8Array(iv)},key,
  new TextEncoder().encode(JSON.stringify(value)));
 return {iv,cipher};
}
async function decrypt<T>(key:CryptoKey,iv:number[],cipher:ArrayBuffer):Promise<T>{
 const a=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(iv)},key,cipher);
 return JSON.parse(new TextDecoder().decode(a)) as T;
}
const workspaceId=(owner:string)=>"workspace:"+owner;
function close(db:IDBDatabase){db.close()}
export async function hasWorkspace(owner:string):Promise<boolean>{
 const db=await openOfflineDB();
 try{return !!await tx(db.transaction("workspaces").objectStore("workspaces").get(workspaceId(owner)))}
 finally{close(db)}
}
export async function unlockWorkspace(owner:string,phrase:string):Promise<CryptoKey>{
 if(phrase.length<12)throw Error("Use a private passphrase of at least 12 characters");
 const db=await openOfflineDB();
 try{
  const store=db.transaction("workspaces").objectStore("workspaces");
  const saved=await tx(store.get(workspaceId(owner))) as Workspace|undefined;
  if(saved){
   const key=await derive(phrase,saved.salt);
   try{
    const value=await decrypt<string>(key,saved.iv,saved.check);
    if(value!=="repair-cafe-offline:"+owner)throw Error("Incorrect passphrase");
   }catch{throw Error("Wrong offline passphrase. Saved work has not been changed.")}
   return key;
  }
  const salt=bytes(16),key=await derive(phrase,salt);
  const sample=await encrypt(key,"repair-cafe-offline:"+owner);
  const tx2=db.transaction("workspaces","readwrite");
  await tx(tx2.objectStore("workspaces").add({
   key:workspaceId(owner),salt,iv:sample.iv,check:sample.cipher
  } as Workspace));
  return key;
 }finally{close(db)}
}
export async function readOperations(owner:string,key:CryptoKey):Promise<OfflineOperation[]>{
 const db=await openOfflineDB();
 try{
  const all=await tx(db.transaction("operations").objectStore("operations").getAll()) as Stored[];
  const ops=await Promise.all(all.filter(x=>x.owner===owner).map(async x=>{
   const v=await decrypt<{kind:OfflineKind;payload:Record<string,string|boolean>}>(
     key,x.iv,x.cipher);
   return {id:x.key,owner:x.owner,eventId:x.eventId,createdAt:x.createdAt,
    status:x.status,error:x.error,kind:v.kind,payload:v.payload};
  }));
  return ops.sort((a,b)=>a.createdAt-b.createdAt);
 }finally{close(db)}
}
export async function writeOperation(op:OfflineOperation,key:CryptoKey){
 const sealed=await encrypt(key,{kind:op.kind,payload:op.payload});
 const db=await openOfflineDB();
 try{
  const item:Stored={key:op.id,owner:op.owner,eventId:op.eventId,
   createdAt:op.createdAt,status:op.status,error:op.error||"",
   iv:sealed.iv,cipher:sealed.cipher};
  await tx(db.transaction("operations","readwrite").objectStore("operations").add(item));
 }finally{close(db)}
}
export async function updateOperationState(owner:string,id:string,status:OfflineStatus,error:string){
 const db=await openOfflineDB();
 try{
  const transaction=db.transaction("operations","readwrite"),store=transaction.objectStore("operations");
  const item=await tx(store.get(id)) as Stored|undefined;
  if(!item||item.owner!==owner)throw Error("Saved operation not found for this account");
  await tx(store.put({...item,status,error:error.slice(0,220)}));
 }finally{close(db)}
}
export async function dropOperation(owner:string,id:string){
 const db=await openOfflineDB();
 try{
  const transaction=db.transaction("operations","readwrite"),store=transaction.objectStore("operations");
  const item=await tx(store.get(id)) as Stored|undefined;
  if(item?.owner===owner)await tx(store.delete(id));
 }finally{close(db)}
}
export async function encryptedBackup(owner:string):Promise<string>{
 const db=await openOfflineDB();
 try{
  const [records,workspace]=await Promise.all([
   tx(db.transaction("operations").objectStore("operations").getAll()) as Promise<Stored[]>,
   tx(db.transaction("workspaces").objectStore("workspaces").get(workspaceId(owner))) as Promise<Workspace|undefined>
  ]);
  if(!workspace)throw Error("Offline vault does not exist");
  return JSON.stringify({format:"repair-cafe-encrypted-backup-v1",createdAt:new Date().toISOString(),
   workspace:{...workspace,check:Array.from(new Uint8Array(workspace.check))},
   operations:records.filter(x=>x.owner===owner).map(x=>({
    ...x,cipher:Array.from(new Uint8Array(x.cipher))
   }))},null,2);
 }finally{close(db)}
}

// Only the event UUID is in unencrypted workspace metadata. All visitor data
// and previous queue state are encrypted with the user's offline passphrase.
export async function registerOfflineEvent(owner:string,eventId:string){
 if(!/^[a-f0-9-]{36}$/i.test(eventId))return;
 const db=await openOfflineDB();
 try{
  const tr=db.transaction("workspaces","readwrite"),store=tr.objectStore("workspaces");
  const workspace=await tx(store.get(workspaceId(owner))) as Workspace|undefined;
  if(workspace)await tx(store.put({...workspace,eventId}));
 }finally{close(db)}
}
export async function writeOfflineSnapshot(
 owner:string,eventId:string,key:CryptoKey,
 state:{tickets:unknown[];stations:unknown[]}
){
 if(!/^[a-f0-9-]{36}$/i.test(eventId))return;
 const sealed=await encrypt(key,state),db=await openOfflineDB();
 try{
  await tx(db.transaction("snapshots","readwrite").objectStore("snapshots").put({
   key:"snapshot:"+owner+":"+eventId,owner,eventId,
   savedAt:Date.now(),iv:sealed.iv,cipher:sealed.cipher
  }));
 }finally{close(db)}
}
