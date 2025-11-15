/**
 * Service Worker for Kids Meal Planner
 * Provides offline caching and background sync capabilities
 */

const CACHE_NAME = 'meal-planner-v1.0.0';
const RUNTIME_CACHE = 'meal-planner-runtime';

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/print.css',
  '/js/core/app.js',
  '/js/core/app-improvements.js',
  '/js/core/critical-fixes.js',
  '/js/core/firebase-api.js',
  '/js/core/firebase-config.js',
  '/js/modules/i18n.js',
  '/js/modules/autosave-undo.js',
  '/js/modules/rules.js',
  '/js/modules/sounds.js',
  '/js/modules/guidance.js',
  '/js/modules/categorized-view.js',
  '/js/utils/auth.js',
  '/js/utils/security.js',
  '/js/utils/offline-support.js',
  '/js/utils/state-manager.js',
  '/js/utils/modal.js',
  '/js/utils/error-handler.js',
  '/js/utils/event-manager.js',
  '/js/utils/async-lock.js',
  '/js/utils/mobile-support.js',
  '/data/kids_breakfast_box_defaults_bilingual.csv',
  '/manifest.json'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[ServiceWorker] Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[ServiceWorker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for API calls (Firebase)
  if (url.pathname.includes('firestore') || url.pathname.includes('firebase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for app resources
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          fetch(request)
            .then((response) => {
              if (response.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, response);
                });
              }
            })
            .catch(() => {
              // Network error, but we have cache
            });
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }

            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
      })
  );
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  if (event.tag === 'sync-meals') {
    event.waitUntil(syncMeals());
  }
});

async function syncMeals() {
  // This would integrate with the existing offline-support.js
  // to sync queued operations when back online
  console.log('[ServiceWorker] Syncing meals...');
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_REQUEST',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Push notification support (for future features)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'New meal plan update!',
    icon: '/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    badge: '/android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Kids Meal Planner', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
