/**
 * sw-push.js
 * Push notification handler — imported into the Workbox service worker
 * via vite-plugin-pwa's importScripts option.
 *
 * Handles two events:
 * 1. 'push' — received from the push server, shows a notification
 * 2. 'notificationclick' — user tapped the notification, opens/focuses the app
 */

self.addEventListener('push', function (event) {
  var data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = {}
  }

  var title = data.title || 'Serenity'
  var options = {
    body: data.body || 'Time for your daily meditation 🌿',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'serenity-reminder',
    renotify: false,
    data: { url: data.url || '/' }
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  var targetUrl = (event.notification.data && event.notification.data.url) || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
      // If the app is already open in a tab, focus it
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].url.indexOf(self.location.origin) !== -1 && 'focus' in clients[i]) {
          return clients[i].focus()
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(targetUrl)
    })
  )
})
