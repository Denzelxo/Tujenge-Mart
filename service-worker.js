// Service Worker for PWA functionality
const CACHE_NAME = 'kenyamart-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/products.html',
    '/about.html',
    '/contact.html',
    '/styles.css',
    '/script.js',
    '/auth.js',
    '/products.js',
    '/cart.js',
    '/ai-assistant.js',
    '/offline.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate service worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

// Sync orders when back online
async function syncOrders() {
    try {
        const offlineOrders = await getOfflineOrders();
        for (const order of offlineOrders) {
            await syncOrder(order);
        }
    } catch (error) {
        console.error('Failed to sync orders:', error);
    }
}

// Get offline orders from IndexedDB
async function getOfflineOrders() {
    return new Promise((resolve) => {
        const request = indexedDB.open('KenyaMartDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const orders = [];
            
            store.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    orders.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(orders);
                }
            };
        };
    });
}

// Sync individual order
async function syncOrder(order) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (response.ok) {
            await removeOfflineOrder(order.id);
        }
    } catch (error) {
        console.error('Failed to sync order:', error);
    }
}

// Remove synced order from IndexedDB
async function removeOfflineOrder(orderId) {
    return new Promise((resolve) => {
        const request = indexedDB.open('KenyaMartDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            store.delete(orderId);
            resolve();
        };
    });
} 