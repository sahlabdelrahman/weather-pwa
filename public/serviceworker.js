const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cahce");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

self.addEventListener("activate", (event) => {
  const cahceWithList = [];
  cahceWithList.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cahcesName) =>
      Promise.all(
        cahcesName.map((cacheName) => {
          if (!cahceWithList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
