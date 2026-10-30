// Service worker — Campagna Ashkar
const CACHE = 'ashkar-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './tabellone/', './nomadi/', './panoceania/',
  './icons/app-192.png', './icons/app-512.png', './icons/app-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
// rete-prima con ricaduta sulla cache: online prendi l'ultima versione, offline giochi lo stesso
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia)).catch(()=>{});
        return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
