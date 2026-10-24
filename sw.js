const CACHE='flow5-v1.3-preview-3';
const ASSETS=['./','./index.html','./styles.css','./manifest.webmanifest',
 './src/app.js','./src/art13.js','./src/config.js','./src/audio.js','./src/i18n.js','./src/selection.js','./audio/work.wav','./audio/rest.wav','./audio/done.wav','./src/data.js','./src/art.js','./src/engine.js',
 './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('flow5-v1.3-preview-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
   return response;
  }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
  return response;
 })));
});
