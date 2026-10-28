const CACHE_NAME = "sabedoria-digital-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.png",
  "/logo.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore non-GET requests or browser extension/auth schemes
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip Next.js dev server hot module reloading and external API calls if necessary
  if (url.pathname.includes("/_next/webpack-hmr") || url.protocol.startsWith("chrome-extension")) {
    return;
  }

  // Network-first strategy for navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const fallback = await caches.match("/");
          return fallback || new Response("Sem conexão com a internet.", {
            headers: { "Content-Type": "text/html; charset=utf-8" },
            status: 503
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for static assets (images, icons, styles, fonts)
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|css|js|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
