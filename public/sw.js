self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('hr-management-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/icons/leave-request.png',
        '/icons/leave-status.png',
        '/icons/attendance.png',
        '/icons/admin-update.png',
        '/icons/badge.png'
      ])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== 'hr-management-v1')
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'mark-attendance') {
    event.waitUntil(
      clients.openWindow('/attendance')
    )
  } else if (event.action === 'approve' || event.action === 'reject') {
    const action = event.action
    event.waitUntil(
      clients.openWindow(`/leave-requests?action=${action}`)
    )
  } else if (event.notification.tag.startsWith('leave-status')) {
    event.waitUntil(
      clients.openWindow('/leaves')
    )
  }
})

self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    ...data.options,
    icon: data.options.icon || '/icons/default.png',
    badge: data.options.badge || '/icons/badge.png'
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
}) 