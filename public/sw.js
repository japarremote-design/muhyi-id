/*
 * Service worker seperlunya saja.
 * Halaman dan berkas program TIDAK pernah disimpan — supaya pembaruan
 * situs langsung terasa, tidak tertahan salinan lama di HP pengunjung.
 * Yang disimpan hanya berkas tetap: ikon, gambar, favicon.
 */
const CACHE = 'muhyi-v2';
const TETAP = ['/manifest.json', '/icons/icon-192.png', '/og.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(TETAP)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  // Buang semua simpanan versi lama, termasuk halaman yang dulu ikut tersimpan.
  e.waitUntil(
    caches.keys()
      .then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== location.origin) return;

  // Hanya gambar dan ikon yang boleh diambil dari simpanan.
  const bolehDisimpan = /\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(new URL(request.url).pathname);
  if (!bolehDisimpan) return; // sisanya biarkan browser mengambil langsung dari server

  e.respondWith(
    caches.match(request).then((tersimpan) =>
      tersimpan ||
      fetch(request).then((res) => {
        const salinan = res.clone();
        caches.open(CACHE).then((c) => c.put(request, salinan));
        return res;
      }),
    ),
  );
});
