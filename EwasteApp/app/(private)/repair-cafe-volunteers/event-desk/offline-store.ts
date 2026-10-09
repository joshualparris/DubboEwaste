// Encrypted, account-scoped offline operations. The non-extractable AES-GCM key
// is stored in this trusted browser's IndexedDB, never exported to the server.
// Anyone who can use this browser profile can access this offline workspace.
// An authenticated account is still required for uploads / server access.
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
type Workspace={key:string;eventId?:string;mode?:"trusted";deviceKey?:CryptoKey;
// Legacy v1 records used passphrase-derived keys. Only used for one-time migration.
salt?:number[];iv?:number[];check?:ArrayBuffer};
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
export type OfflineWorkspaceState="none"|"trusted"|"legacy";
export async function getWorkspaceState(owner:string):Promise<OfflineWorkspaceState>{
 const db=await openOfflineDB();
 try{
  const record=await tx(db.transaction("workspaces").objectStore("workspaces").get(workspaceId(owner))) as Workspace|undefined;
  if(!record)return "none";
  return record.mode==="trusted"&&record.deviceKey?"trusted":"legacy";
 }finally{close(db)}
}
// Kept for existing imports; do not equate a legacy vault with a trusted key.
export async function hasWorkspace(owner:string):Promise<boolean>{
 return (await getWorkspaceState(owner))!=="none";
}
export async function openTrustedWorkspace(owner:string):Promise<CryptoKey>{
 const db=await openOfflineDB();
 try{
  const existing=await tx(db.transaction("workspaces").objectStore("workspaces").get(workspaceId(owner))) as Workspace|undefined;
  if(existing){
   if(existing.mode==="trusted"&&existing.deviceKey)return existing.deviceKey;
   throw Error("An older offline vault exists. Migrate it using its original passphrase before enabling the trusted-device workspace.");
  }
  // WebCrypto stores a NON-EXTRACTABLE key directly via IndexedDB structured clone.
  const deviceKey=await crypto.subtle.generateKey({name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
  try{
   const transaction=db.transaction("workspaces","readwrite");
   await tx(transaction.objectStore("workspaces").add({key:workspaceId(owner),mode:"trusted",deviceKey} as Workspace));
   return deviceKey;
  }catch(e){
   // A second tab may have created the workspace first. Never replace its key.
   if(e instanceof DOMException&&e.name==="ConstraintError"){
    const saved=await tx(db.transaction("workspaces").objectStore("workspaces").get(workspaceId(owner))) as Workspace|undefined;
    if(saved?.mode==="trusted"&&saved.deviceKey)return saved.deviceKey;
   }
   throw e;
  }
 }finally{close(db)}
}
// Legacy encrypted records are never deleted or re-keyed without the user's
// original passphrase. Migration stages all ciphertext before a single write.
export async function migrateLegacyWorkspace(owner:string,phrase:string):Promise<CryptoKey>{
 if(phrase.length<12)throw Error("Enter the old passphrase for this one-time migration");
 const db=await openOfflineDB();
 try{
  const saved=await tx(db.transaction("workspaces").objectStore("workspaces").get(workspaceId(owner))) as Workspace|undefined;
  if(!saved)throw Error("No previous offline workspace on this device");
  if(saved.mode==="trusted"&&saved.deviceKey)return saved.deviceKey;
  if(!saved.salt||!saved.iv||!saved.check)throw Error("Legacy workspace is incomplete; nothing was erased");
  const previousKey=await derive(phrase,saved.salt);
  try{
   const marker=await decrypt<string>(previousKey,saved.iv,saved.check);
   if(marker!=="repair-cafe-offline:"+owner)throw Error("Invalid original key");
  }catch{throw Error("Incorrect old passphrase. Nothing was erased.");}
  const deviceKey=await crypto.subtle.generateKey({name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
  const [operations,snapshots]=await Promise.all([
   tx(db.transaction("operations").objectStore("operations").getAll()) as Promise<Stored[]>,
   tx(db.transaction("snapshots").objectStore("snapshots").getAll()) as Promise<Stored[]>
  ]);
  const rekey=async<T extends Stored>(items:T[])=>{
   const prepared:T[]=[];
   for(const item of items.filter(x=>x.owner===owner)){
    const value=await decrypt<unknown>(previousKey,item.iv,item.cipher);
    const sealed=await encrypt(deviceKey,value);
    prepared.push({...item,iv:sealed.iv,cipher:sealed.cipher});
   }
   return prepared;
  };
  const [newOps,newSnapshots]=await Promise.all([rekey(operations),rekey(snapshots)]);
  // All writes commit together. A browser crash cannot leave half-rekeyed data.
  const transaction=db.transaction(["operations","snapshots","workspaces"],"readwrite");
  for(const item of newOps)transaction.objectStore("operations").put(item);
  for(const item of newSnapshots)transaction.objectStore("snapshots").put(item);
  transaction.objectStore("workspaces").put({
   key:workspaceId(owner),mode:"trusted",deviceKey,eventId:saved.eventId
  } as Workspace);
  await new Promise<void>((resolve,reject)=>{
   transaction.oncomplete=()=>resolve();
   transaction.onerror=()=>reject(transaction.error);
   transaction.onabort=()=>reject(transaction.error||Error("Migration transaction aborted"));
  });
  return deviceKey;
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
  if(workspace.mode==="trusted")throw Error("Trusted-device keys cannot be exported. Synchronise all pending work before changing devices.");
  return JSON.stringify({format:"repair-cafe-encrypted-backup-v1",createdAt:new Date().toISOString(),
   workspace:{...workspace,check:Array.from(new Uint8Array(workspace.check!))},
   operations:records.filter(x=>x.owner===owner).map(x=>({
    ...x,cipher:Array.from(new Uint8Array(x.cipher))
   }))},null,2);
 }finally{close(db)}
}

// Only the event UUID is in unencrypted workspace metadata. All visitor data
// and previous queue state are encrypted with the trusted device's browser key.
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
