// Zaragoza Aire v0.6.2: almacena únicamente la interfaz local. La API de mediciones NO se cachea.
const CACHE='zaragoza-aire-shell-v0.6.2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zaragoza-aire-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 // No interceptamos ninguna petición externa, especialmente API municipal y cartografía.
 if(new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
   e.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));}return r;}).catch(()=>caches.match('./index.html')));
   return;
 }
 e.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
