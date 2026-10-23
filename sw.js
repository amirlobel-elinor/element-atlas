/* Change VERSION whenever you release changed app assets. */
const VERSION='2.3.0';
const PREFIX=`element-atlas-${new URL(self.registration.scope).pathname}-`;
const CACHE=PREFIX+VERSION;
const FILES=['./','./index.html','./styles.css?v=2.3.0','./app.js?v=2.3.0','./core.js?v=2.3.0','./data.js?v=2.3.0','./manifest.webmanifest','./logo.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
const URLS=new Set(FILES.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
  // A failed file prevents activation; the previous complete release stays available.
  await cache.addAll(FILES.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})));
  await self.skipWaiting();
 }));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 const isShell=event.request.mode==='navigate'&&(url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html');
 if(!isShell&&!URLS.has(url.href))return;
 // Serve the complete installed release together. No HTML fallbacks for missing scripts/images.
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const cached=await cache.match(isShell?new URL('./index.html',scope).href:event.request);
  return cached||fetch(event.request);
 }));
});
