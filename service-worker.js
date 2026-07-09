// ======================================================================
// ELH - English Learning Hub
// Progressive Web App Service Worker
// ======================================================================
// Caching Strategy: Cache-First for assets, Network-First for data
// Offline Support: All core pages work without internet
// Update Strategy: Stale-While-Revalidate for app shell
// ======================================================================

const CACHE_NAME = 'elh-v1-2026';
const OFFLINE_CACHE = 'elh-offline-v1';

// Core app shell - always available offline
const APP_SHELL = [
  'index.html',
  'placement-test.html',
  'student_dashboard.html',
  'unit1.html',
  'manifest.json',
  // Fonts (loaded from CDN, cached after first load)
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap'
];

// CDN assets to cache
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
  'https://fonts.gstatic.com'
];

// ======================================================================
// INSTALL: Cache the app shell
// ======================================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell...');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        console.log('[SW] App shell cached successfully');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.log('[SW] Cache failed:', err);
      })
  );
});

// ======================================================================
// ACTIVATE: Clean old caches
// ======================================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== OFFLINE_CACHE)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned');
        return self.clients.claim();
      })
  );
});

// ======================================================================
// FETCH: Cache-first strategy with offline fallback
// ======================================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Supabase API calls (always use network for data)
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Cache-first: return cached, but update in background
          updateCache(request, event);
          return cachedResponse;
        }

        // Network-first for uncached resources
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.ok && response.type === 'basic') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('index.html');
            }
            // Return a basic offline page for other requests
            return new Response(
              '<html><body style="font-family:Cairo,sans-serif;text-align:center;padding:40px">' +
              '<h1>🤖 ELH Offline</h1>' +
              '<p>You\'re offline. Please check your connection.</p>' +
              '<p>Previously visited pages are still available.</p>' +
              '</body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
      })
  );
});

// ======================================================================
// BACKGROUND CACHE UPDATE
// ======================================================================
function updateCache(request, event) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
    })
    .catch(() => {
      // Silently fail - we have the cached version
    });
}

// ======================================================================
// PUSH NOTIFICATIONS (Future feature)
// ======================================================================
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New lesson available!',
    icon: 'icon-192.png',
    badge: 'icon-72.png',
    vibrate: [100, 50, 100],
    data: { url: 'student_dashboard.html' },
    actions: [
      { action: 'open', title: 'Open ELH' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ELH - English Learning Hub', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Focus existing window or open new
          for (const client of clientList) {
            if (client.url.includes('student_dashboard.html') && 'focus' in client) {
              return client.focus();
            }
          }
          return clients.openWindow('student_dashboard.html');
        })
    );
  }
});

// ======================================================================
// BACKGROUND SYNC (Future feature)
// ======================================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncStudentProgress());
  }
});

async function syncStudentProgress() {
  // Future: Sync localStorage progress to Supabase when online
  console.log('[SW] Background sync triggered');
}
