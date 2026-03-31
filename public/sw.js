const CACHE_NAME = 'organic-food-v2'
const RUNTIME_CACHE = 'organic-food-runtime-v2'
const IMAGE_CACHE = 'organic-food-images-v2'

function isImageRequest(request) {
  return request.destination === 'image'
}
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/login',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Cache-first for same-origin images (product images/icons) for snappy UI.
  if (url.origin === self.location.origin && isImageRequest(event.request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        const response = await fetch(event.request)
        if (response && response.ok) cache.put(event.request, response.clone())
        return response
      })
    )
    return
  }

  // Network-first for API so data stays fresh, with cache fallback offline.
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy))
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Default: cache, then network (and store in runtime cache).
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        const copy = response.clone()
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy))
        return response
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE].includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('push', (event) => {
  const data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200]
  })
})
