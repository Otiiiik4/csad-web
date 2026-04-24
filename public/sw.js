self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch (online only, no offline caching)
  // This satisfies the PWA install requirement for Chrome
  event.respondWith(fetch(event.request));
});
