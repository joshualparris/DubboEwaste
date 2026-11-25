export type InventoryDevice={category:string;manufacturer:string|null;model:string|null;asset_code:string;serial_imei:string|null;status:string;data_state:string;initial_route:string|null;programme?:string;location_id?:string|null;job_id?:string|null};
export const families=["Macs","iPhones","iPads","Laptops","Desktops","Chromebooks","Other phones","Other tablets","Monitors & TVs","Networking","Printers","Storage & drives","Parts","Wearables","Other equipment"] as const;
export function deviceFamily(a:InventoryDevice):string{
 const model=(a.model||"").toLowerCase(), maker=(a.manufacturer||"").toLowerCase(), c=a.category.toUpperCase();
 if(/\biphone\b/.test(model))return "iPhones";
 if(/\bipad\b/.test(model))return "iPads";
 if(/\b(?:imac|macbook|mac mini|mac studio|mac pro|power mac|powermac|ibook|powerbook)\b/.test(model)||(maker==="apple"&&["LAPTOP","DESKTOP"].includes(c)))return "Macs";
 if(/\bchromebook\b/.test(model)||c==="CHROMEBOOK")return "Chromebooks";
 if(c==="LAPTOP")return "Laptops";
 if(c==="DESKTOP")return "Desktops";
 if(c==="PHONE")return "Other phones";
 if(c==="TABLET")return "Other tablets";
 if(c==="MONITOR"||c==="TV")return "Monitors & TVs";
 if(c==="NETWORKING")return "Networking";
 if(c==="PRINTER")return "Printers";
 if(/\b(?:hdd|ssd|hard drive|hard disk|solid state drive|canvio|flash drive|usb drive)\b/.test(model))return "Storage & drives";
 if(c==="PARTS")return "Parts";
 if(/\b(?:fitbit|apple watch|smartwatch|galaxy watch)\b/.test(maker+" "+model))return "Wearables";
 return "Other equipment";
}
export type InventoryFilters={family:string;category:string;brand:string;status:string;data:string;route:string;query:string;location:string;job:string};
export const emptyFilters:InventoryFilters={family:"",category:"",brand:"",status:"",data:"",route:"",query:"",location:"",job:""};
export function matchesInventory(a:InventoryDevice,f:InventoryFilters){
 const terms=f.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const hay=[a.asset_code,a.manufacturer,a.model,a.serial_imei,a.category,deviceFamily(a)].filter(Boolean).join(" ").toLowerCase();
 return (!f.family||deviceFamily(a)===f.family)&&(!f.category||a.category===f.category)&&(!f.brand||(a.manufacturer||"").toLowerCase()===f.brand)&&(!f.status||a.status===f.status)&&(!f.data||a.data_state===f.data)&&(!f.route||a.initial_route===f.route)&&(!f.location||(a.location_id||"__none")===f.location)&&(!f.job||(a.job_id||"__none")===f.job)&&terms.every(t=>hay.includes(t));
}
export function inventoryGroups<T extends InventoryDevice>(rows:T[],grouped:boolean){
 if(!grouped)return rows.length?[{name:"All matching assets",rows}]:[];
 return families.map(name=>({name,rows:rows.filter(a=>deviceFamily(a)===name)})).filter(g=>g.rows.length);
}
