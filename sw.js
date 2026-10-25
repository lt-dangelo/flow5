// Scoped preview service worker: network-first for app updates, offline fallback.
const CACHE='flow5-v1.3-preview-23';
const CORE=[
 './',
 './index.html',
 './styles.css?build=1.3.23',
 './src/app.js?build=1.3.23',
 './manifest.webmanifest',
 './src/art13.js','./src/recovery13.js','./artwork/bear-master-v1322.webp','./artwork/heeltouch-master-v1322.webp','./artwork/snowangel-master-v1322.webp','./artwork/calfraise-master-v1321.webp','./artwork/wallsit-master-v1319.webp','./artwork/jumpingjacks-master-v1320.webp','./artwork/pikepushup-master-v1318.webp','./artwork/wallpushup-master-v1317.webp','./artwork/squat-master.webp','./artwork/pushup-master.webp','./artwork/plank-master.webp','./artwork/recovery.webp','./artwork/lunge-master.webp','./artwork/mountain-master.webp','./artwork/bridge-master.webp','./artwork/recovery-hydration-corrected.webp','./artwork/march-master.webp','./artwork/bicycle-master.webp','./artwork/sideplank-master.webp','./artwork/shouldertap-clean-v1315.webp','./artwork/birddog-master.webp','./artwork/deadbug-clean-v1315.webp','./artwork/superman-master.webp','./src/config.js','./src/audio.js',
 './src/i18n.js','./src/selection.js','./src/data.js',
 './src/art.js','./src/engine.js',
 './audio/work.wav','./audio/rest.wav','./audio/done.wav',
 './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{await cache.addAll(CORE);}).then(()=>self.skipWaiting()));
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
