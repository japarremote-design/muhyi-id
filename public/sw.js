/* Service worker sederhana: cangkang aplikasi + fallback luring. */
const CACHE = 'muhyi-v1';
const INTI = ['/', '/aspirasi', '/luring', '/manifest.json', '/icons/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(INTI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  if (request.url.includes('/api/')) return;

  e.respondWith(
    fetch(request)
      .then((res) => {
        const salinan = res.clone();
        caches.open(CACHE).then((c) => c.put(request, salinan));
        return res;
      })
      .catch(() => caches.match(request).then((c) => c || caches.match('/luring'))),
  );
});
