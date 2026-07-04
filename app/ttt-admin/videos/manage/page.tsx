"use client";
import { useEffect, useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { VideoDoc } from "@/components/VideoCard";

export default function ManageVideos() {
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = () => {
    fetch("/api/videos?limit=100")
      .then(r => r.json())
      .then((data: VideoDoc[]) => { setVideos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchVideos(); }, []);

  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
    const data = await res.json() as { success: boolean };
    if (data.success) { toast.success("Deleted!"); fetchVideos(); }
    else toast.error("Delete failed");
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>📋 Manage Videos</h1>
        <a href="/ttt-admin/videos/new" className="btn-primary" style={{ textDecoration: "none" }}>+ New Video</a>
      </div>

      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 24, color: "#555" }}>Loading...</p>
        ) : videos.length === 0 ? (
          <p style={{ padding: 24, color: "#555" }}>No videos yet. <a href="/ttt-admin/videos/new" style={{ color: "#e94560" }}>Upload first video →</a></p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#666", fontSize: 12, borderBottom: "1px solid #2a2a2a", background: "#111" }}>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>Title</th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>Category</th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>Type</th>
                <th style={{ textAlign: "right", padding: "12px 16px" }}>Views</th>
                <th style={{ textAlign: "right", padding: "12px 16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(v => (
                <tr key={v.id} style={{ borderBottom: "1px solid #1f1f1f", fontSize: 14 }}>
                  <td style={{ padding: "12px 16px", color: "#ccc", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "rgba(233,69,96,0.15)", color: "#e94560", borderRadius: 4, padding: "2px 8px", fontSize: 12 }}>{v.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888", fontSize: 12 }}>{v.videoType}</td>
                  <td style={{ padding: "12px 16px", color: "#888", textAlign: "right" }}>{v.views ?? 0}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <a href={`/video/${v.id}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#3b82f6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 6, padding: "4px 8px", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                        <ExternalLink size={12} /> View
                      </a>
                      <button onClick={() => deleteVideo(v.id)}
                        style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
