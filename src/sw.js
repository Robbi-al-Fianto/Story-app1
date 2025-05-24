// src/sw.js

const SHELL_CACHE = 'story-app-shell-v1';
const SHELL_FILES = [
  'index.html',    
  'app.bundle.js', 
  'styles.css',       
  'manifest.json', 
  'icons/icon-144.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'screenshots/ss1.png',
  'screenshots/ss2.png'
];

// Install: cache shell
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_FILES))
      .catch(err => {
        console.error('Cache shell gagal:', err);
      })
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== SHELL_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: coba cache dulu, baru network
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cached => 
      cached || fetch(evt.request)
    )
  );
});

// Push: tampilkan notifikasi
self.addEventListener('push', evt => {
  let data = { title: 'New Notification', body: 'You have a new message', url: '/' };
  try { data = evt.data.json(); } catch {}
  const options = {
    body: data.body,
    icon: 'icons/icon-192.png',   
    badge: 'icons/icon-512.png', 
    data: { url: data.url },
  };
  evt.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click: navigasi
self.addEventListener('notificationclick', evt => {
  evt.notification.close();
  const url = evt.notification.data.url || '/';
  evt.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      const win = list.find(w => w.url === url);
      return win ? win.focus() : clients.openWindow(url);
    })
  );
});
