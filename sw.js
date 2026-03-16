/**
 * Panos Kokmotos — Service Worker
 * Strategy: Cache-first for shell assets, network-first for API calls.
 * Serves offline.html when a navigation request fails.
 */

const CACHE_NAME = 'panos-v1';
const OFFLINE_URL = '/offline.html';

// Assets to pre-cache on install
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/chat.js',
  '/offline.html',
  '/photo.webp',
  '/photo.jpg',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
];

// ── Install: pre-cache shell ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: remove old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: cache-first for static assets, network-first for navigation ──
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET, chrome-extension, and API calls
  if (request.method !== 'GET') return;
  if (request.url.includes('workers.dev')) return;
  if (request.url.includes('formspree.io')) return;

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          // Cache a fresh copy
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        // Only cache same-origin and whitelisted cdn assets
        if (
          res.ok &&
          (request.url.startsWith(self.location.origin) ||
           request.url.includes('fonts.googleapis.com') ||
           request.url.includes('fonts.gstatic.com'))
        ) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return res;
      });
    })
  );
});
