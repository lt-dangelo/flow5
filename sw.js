// Scoped preview service worker: network-first for app updates, offline fallback.
const CACHE='flow5-v1.3-preview-4';
const CORE=[
 './',
 './index.html',
 './styles.css?build=1.3.4',
 './src/app.js?build=1.3.4',
 './manifest.webmanifest',
 './src/art13.js','./src/config.js','./src/audio.js',
 './src/i18n.js','./src/selection.js','./src/data.js',
 './src/art.js','./src/engine.js',
 './audio/work.wav','./audio/rest.wav','./audio/done.wav',
 './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('flow5-v1.3-preview-')&&key!==CACHE).map(key=>caches.delete(key)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.location.href).pathname))return;
 const dynamic=req.mode==='navigate'||/\.(?:js|css)$/.test(url.pathname);
 if(dynamic){
  event.respondWith(fetch(req,{cache:'no-store'}).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)));}
   return response;
  }).catch(()=>caches.match(req).then(hit=>hit||(req.mode==='navigate'?caches.match('./index.html'):undefined))));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)));}
  return response;
 })));
});
