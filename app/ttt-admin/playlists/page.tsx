"use client";
import Link from "next/link";

export default function PlaylistsAdmin() {
  const playlists = [
    { key: "news", icon: "📰", label: "Latest News", ta: "சமீபத்திய செய்திகள்" },
    { key: "money", icon: "💰", label: "Make Money Online", ta: "ஆன்லைன் பணம் சம்பாதிக்கும் வழிகள்" },
    { key: "parttime", icon: "⏰", label: "Part-Time Jobs", ta: "பார்ட் டைம் வேலை" },
    { key: "online", icon: "💻", label: "Online Jobs", ta: "ஆன்லைன் வேலை" },
    { key: "lifetime", icon: "🏆", label: "Lifetime Jobs", ta: "நிரந்தர வேலை" },
    { key: "mobile", icon: "📱", label: "Mobile Tricks", ta: "மொபைல் டிரிக்ஸ்" },
    { key: "apps", icon: "⭐", label: "App Reviews", ta: "ஆப் ரிவியூ" },
  ];

  return (
    <>
      <h1 className="admin-page-title">📋 Playlists / Categories</h1>
      <p style={{ color: "#888", marginBottom: 20, fontSize: 14 }}>Videos are organized by category. When you upload a video, choose the category to add it to a playlist.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {playlists.map(p => (
          <div key={p.key} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 36 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "white", fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>{p.ta}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/playlist/${p.key}`} target="_blank" style={{ fontSize: 12, color: "#e94560" }}>View →</Link>
                <Link href={`/ttt-admin/videos/new`} style={{ fontSize: 12, color: "#22c55e" }}>+ Add Video</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
