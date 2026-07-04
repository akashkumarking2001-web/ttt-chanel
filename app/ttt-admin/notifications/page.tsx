"use client";
import { useState, useEffect } from "react";
import { Send, Bell, Image } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsAdmin() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [image, setImage] = useState("");
  const [sending, setSending] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/notify")
      .then(r => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => {});
  }, []);

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) { toast.error("Title and message are required"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", title, body, url, image }),
      });
      const data = await res.json() as { success: boolean; sent?: number; failed?: number; total?: number };
      if (data.success) {
        toast.success(`Sent to ${data.sent} subscribers! (${data.failed} failed)`);
        setTitle(""); setBody(""); setUrl("/"); setImage("");
      } else {
        toast.error("Failed to send notifications");
      }
    } catch { toast.error("Error sending notifications"); }
    setSending(false);
  };

  return (
    <>
      <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Bell size={24} /> Push Notifications
      </h1>

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Bell size={32} style={{ color: "#f59e0b" }} />
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{count ?? "—"}</div>
            <div style={{ color: "#888", fontSize: 13 }}>Total Subscribers</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <Send size={18} /> Send Notification
        </h3>
        <form onSubmit={sendNotification}>
          <div className="form-group">
            <label className="form-label">Notification Title *</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. New Video Published!" id="notif-title" />
          </div>
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea className="form-textarea" value={body} onChange={e => setBody(e.target.value)} required placeholder="e.g. Check out our latest video on mobile tricks..." id="notif-body" style={{ minHeight: 100 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Link (URL on click)</label>
            <input className="form-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="/video/..." id="notif-url" />
          </div>
          <div className="form-group">
            <label className="form-label">Thumbnail / Image URL (Optional)</label>
            <input className="form-input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/thumbnail.jpg" id="notif-image" />
          </div>
          <button type="submit" className="btn-primary" disabled={sending} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Send size={16} /> {sending ? "Sending..." : `Send to All ${count ?? ""} Subscribers`}
          </button>
        </form>
      </div>
    </>
  );
}
