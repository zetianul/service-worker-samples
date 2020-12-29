var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    './',
    './index.html',
    './changzeyamei.jpg',
];
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('提前缓存奥');
            return cache.addAll(urlsToCache);
        })
    );
});


self.addEventListener('fetch', (event) => {
    console.log(event.request.url)
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }

          const fetchRequest = event.request.clone()

          return fetch(fetchRequest).then(response => {
            if(!response || response.status!== 200 || response.type !== 'basic'){
              return response
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
        }
      )
    );
  });