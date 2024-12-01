const CACHE_NAME = "expense-tracker-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  //   "/static/js/bundle.js",
  //   "/static/css/main.css",
  // Add other routes or assets here
  "/assets/logo1.webp",
  "/assets/logo2.webp",
  "/assets/logo3.webp",
  
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If cache hit, return it; otherwise, fetch from the network
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
