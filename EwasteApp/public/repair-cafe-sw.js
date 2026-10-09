/* Repair Café offline navigation fallback.
   Never cache signed-in HTML, Supabase requests, Next responses, photos or user data. */
const CACHE="repair-cafe-static-offline-v1";
const FALLBACK="/repair-cafe-offline.html";
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.add(FALLBACK)));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
  keys.filter(key=>key.startsWith("repair-cafe-static-offline-")&&key!==CACHE)
   .map(key=>caches.delete(key)))));
 self.clients.claim();
});
self.addEventListener("fetch",event=>{
 const request=event.request,url=new URL(request.url);
 if(request.mode!=="navigate"||url.origin!==self.location.origin||
   !url.pathname.startsWith("/repair-cafe-volunteers/event-desk"))return;
 event.respondWith(fetch(request).catch(async()=>{
  const cached=await caches.open(CACHE).then(c=>c.match(FALLBACK));
  return cached||new Response("Offline fallback is not cached. Keep the current tab open.",{
   status:503,headers:{"Content-Type":"text/plain","Cache-Control":"no-store"}
  });
 }));
});
