// SELBAR Delivery PWA Service Worker with Background Sync
const CACHE_NAME = 'selbar-delivery-cache-v1';
const STATIC_ASSETS = [
  '/delivery',
  '/delivery/profile',
  '/delivery/history',
  '/delivery/verify',
  '/manifest.json',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Intercept network requests with Stale-While-Revalidate for app shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip API mutations from cache
  if (url.pathname.startsWith('/api/') && event.request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/delivery')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networked = fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          })
          .catch(() => cached);
        return cached || networked;
      })
    );
  }
});

// Background Sync Handler for Offline Proof of Delivery
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-delivery-proofs') {
    event.waitUntil(replayPendingProofs());
  }
});

async function replayPendingProofs() {
  const allClients = await self.clients.matchAll();
  for (const client of allClients) {
    client.postMessage({
      type: 'REPLAY_OFFLINE_PROOFS',
      timestamp: Date.now(),
    });
  }
}

// WebPush Native Notification Display Handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || 'SELBAR Delivery Update';
    const options = {
      body: payload.body || 'Your delivery executive is nearby.',
      icon: payload.icon || '/icon.svg',
      badge: payload.badge || '/favicon.ico',
      data: payload.data || {},
      vibrate: [200, 100, 200],
      tag: payload.data?.orderId || 'delivery-proximity',
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('[SW Push Error]', err);
  }
});

// Notification Click: Open / Focus the Order Tracking URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/account';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

