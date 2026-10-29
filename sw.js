/* LBSNAA Quest service worker: app shell cached, live data always from network */
const CACHE = 'lbsnaa-quest-v2';
const SHELL = ['./','index.html','styles.css','upsc-data.js','current-affairs.js','app.js','manifest.json','icons/icon-192.png','icons/icon-512.png'];
const CDN = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];
// Hosts whose responses are live data and must never be cached
const LIVE = ['openlibrary.org','archive.org','covers.openlibrary.org','api.rss2json.com','pib.gov.in'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    // CDN assets are best-effort so one failure doesn't break install
    await Promise.all(CDN.map(u => c.add(u).catch(() => {})));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) return;
  if (LIVE.some(h => url.hostname === h || url.hostname.endsWith('.' + h))) return; // straight to network

  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin) {
    // network-first so updates show up; cache is the offline fallback
    e.respondWith(fetch(req).then(r => {
      if (r && r.status === 200) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(req, cl)); }
      return r;
    }).catch(async () => (await caches.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())));
  } else {
    // CDN libs/fonts: cache-first
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r && (r.status === 200 || r.type === 'opaque')) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(req, cl)); }
      return r;
    })));
  }
});
