// Web Push client utility (replaces Firebase FCM)

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Request permission & get subscription
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications are not supported in this browser");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");
    
    // Wait for the service worker to become active
    await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send subscription to server
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "subscribe",
        subscription: subscription.toJSON(),
      }),
    });

    const data = await res.json() as { success: boolean };
    if (data.success) {
      // Return endpoint as a unique token identifier
      return subscription.endpoint;
    }
    return null;
  } catch (error) {
    console.error("Web Push Subscription Error:", error);
    return null;
  }
}

// Listen for foreground messages (not strictly needed with web push since the browser handles notifications,
// but we keep a dummy function to avoid breaking imports elsewhere)
export async function onForegroundMessage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _callback: (payload: unknown) => void
) {
  return () => {};
}
