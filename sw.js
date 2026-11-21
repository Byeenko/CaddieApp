// Offline support. On install, every file listed in precache.json is saved to the
// phone; after that the app and the whole library load with no internet connection.
// tools/build-content.mjs updates VERSION whenever any file changes, which tells
// the phone to fetch the new version next time the app opens.

const VERSION = '74a30fa987e3';
const CACHE = `caddie-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const res = await fetch('precache.json', { cache: 'no-store' });
      const { files } = await res.json();
      const cache = await caches.open(CACHE);
      await cache.addAll(files.map((f) => new Request(f, { cache: 'reload' })));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('caddie-') && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      // Opening the app: always serve the cached shell.
      if (req.mode === 'navigate') {
        return (await cache.match('./index.html')) || (await cache.match('./')) || fetch(req);
      }
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch {
        return new Response('Offline and not cached', { status: 503 });
      }
    })()
  );
});
