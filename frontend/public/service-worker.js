
// public/service-worker.js (built by Vite copy or served statically)
// Basic app-shell caching
const CACHE = 'equiptracker-cache-v1';
const ASSETS = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Network-first for API, cache-first for others
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  } else {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(cache => cache.put(request, resClone));
        return res;
      }).catch(() => cached))
    );
  }
});
