// Simple service worker — sirf app ko "installable" banane ke liye.
// FIX: Ab ye sirf apni site ki (same-origin) GET requests handle karta hai.
// Firebase, Firestore, CDN scripts (jspdf, html2canvas, xlsx, gstatic, cdnjs)
// jaisi requests ko bilkul touch nahi karta — unhe seedha network par jaane
// deta hai. Pehle wala version SAARI requests intercept kar raha tha, jisse
// Firebase login/data-sync beech mein fail ho jaata tha aur app "Preparing
// your studio" wale loading screen par hamesha atki reh jaati thi.

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // Sirf GET requests handle karo.
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // Apni site (same-origin) ke alawa kuch bhi mat chuo — Firebase,
  // Firestore, Google APIs, CDN scripts sab isse untouched, direct
  // network par jaayenge.
  if (url.origin !== self.location.origin) return;

  // Same-origin GET: seedha network se lao. Koi offline caching nahi
  // (jaan-boojh kar), taaki hamesha latest HTML/manifest/icons milein.
  event.respondWith(
    fetch(event.request).catch(function () {
      return new Response('Network error', { status: 503, statusText: 'Offline' });
    })
  );
});
