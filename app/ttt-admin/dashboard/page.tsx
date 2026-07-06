"use client";
import { useEffect, useState } from "react";
import { Video, Eye, MessageSquare, Bell } from "lucide-react";

interface Stats { videos: number; views: number; comments: number; subscribers: number; }
interface VideoRow { id: string; title: string; views: number; category: string; createdAt: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ videos: 0, views: 0, comments: 0, subscribers: 0 });
  const [recent, setRecent] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/videos?limit=5").then(r => r.json()),
    ]).then(([statsData, videosData]: [Stats, VideoRow[]]) => {
      setStats(statsData);
      setRecent(Array.isArray(videosData) ? videosData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Videos", value: stats.videos, icon: Video, color: "#e94560" },
    { label: "Total Views", value: stats.views.toLocaleString(), icon: Eye, color: "#3b82f6" },
    { label: "Comments", value: stats.comments, icon: MessageSquare, color: "#10b981" },
    { label: "Subscribers", value: stats.subscribers, icon: Bell, color: "#f59e0b" },
  ];

  return (
    <div>
      <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800, marginBottom: 28 }}>Dashboard</h1>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#888" }}>{label}</span>
              <Icon size={18} style={{ color }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
              {loading ? <div style={{ width: 60, height: 32, background: "#333", borderRadius: 4, animation: "pulse 1.5s infinite" }} /> : value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Videos */}
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: 20 }}>
        <h2 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>Recent Videos</h2>
        {loading ? (
          <p style={{ color: "#555" }}>Loading...</p>
        ) : recent.length === 0 ? (
          <p style={{ color: "#555" }}>No videos yet. <a href="/ttt-admin/videos/new" style={{ color: "#e94560" }}>Upload the first one →</a></p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#666", fontSize: 12, borderBottom: "1px solid #2a2a2a" }}>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Title</th>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Category</th>
                <th style={{ textAlign: "right", padding: "8px 12px" }}>Views</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(v => (
                <tr key={v.id} style={{ borderBottom: "1px solid #1f1f1f", fontSize: 14 }}>
                  <td style={{ padding: "10px 12px", color: "#ccc", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: "rgba(233,69,96,0.15)", color: "#e94560", borderRadius: 4, padding: "2px 8px", fontSize: 12 }}>{v.category}</span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#888", textAlign: "right" }}>{v.views ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
