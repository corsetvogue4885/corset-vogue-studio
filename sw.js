// Bahut simple service worker — sirf app ko installable banane ke liye.
// Ye offline cache nahi karta, taaki hamesha latest HTML load ho
// (jab bhi aap GitHub/Vercel par file update karo, turant reflect hoga).

self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  self.clients.claim();
});

// Fetch handler required for "installability" check on some Android browsers.
self.addEventListener('fetch', function(event){
  event.respondWith(fetch(event.request).catch(function(){
    return caches.match(event.request);
  }));
});
