
self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "⚽ WINN GOAL";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "Yeni gol bildirimi",
      icon: "./icon.png",
      data: { url: "./index.html" }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "./index.html")
  );
});
