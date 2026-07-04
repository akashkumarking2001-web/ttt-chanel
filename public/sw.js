// Web Push Service Worker
self.addEventListener("push", function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "Top Tamil Tricks";
    const options = {
      body: data.body || "New video published!",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      image: data.image || "",
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    console.error("Failed to parse push data:", e);
    // Fallback if not JSON
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("Top Tamil Tricks", {
        body: text,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        image: "",
        data: { url: "/" },
      })
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
