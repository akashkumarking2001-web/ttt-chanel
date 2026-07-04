// Push notifications subscribe/send API
import { NextRequest, NextResponse } from "next/server";
import { d1Query, genId } from "@/lib/d1";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json() as { action: string; subscription?: PushSubscription; title?: string; body?: string; url?: string; image?: string };

  if (body.action === "subscribe") {
    const sub = body.subscription as unknown as { endpoint: string; keys: { p256dh: string; auth: string } };
    const id = genId();
    await d1Query(
      "INSERT OR REPLACE INTO subscribers (id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)",
      [id, sub.endpoint, sub.keys.p256dh, sub.keys.auth]
    );
    return NextResponse.json({ success: true });
  }

  if (body.action === "send") {
    const result = await d1Query<{ endpoint: string; p256dh: string; auth: string }>(
      "SELECT endpoint, p256dh, auth FROM subscribers"
    );

    const payload = JSON.stringify({
      title: body.title || "Top Tamil Tricks",
      body: body.body || "New video published!",
      url: body.url || "/",
      image: body.image || "",
    });

    let sent = 0;
    let failed = 0;
    for (const sub of result.results) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch {
        // Remove expired subscriptions
        await d1Query("DELETE FROM subscribers WHERE endpoint = ?", [sub.endpoint]);
        failed++;
      }
    }
    return NextResponse.json({ success: true, sent, failed, total: result.results.length });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET() {
  const result = await d1Query("SELECT COUNT(*) as count FROM subscribers");
  const count = (result.results[0] as { count: number })?.count ?? 0;
  return NextResponse.json({ count });
}
