"use client";
import { useEffect, useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Comment { id: string; videoId: string; name: string; text: string; createdAt: number; }

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    fetch("/api/comments?all=1")
      .then(r => r.json())
      .then((data: Comment[]) => { setComments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, []);

  const deleteComment = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
    const data = await res.json() as { success: boolean };
    if (data.success) { toast.success("Comment deleted!"); fetchComments(); }
    else toast.error("Delete failed");
  };

  return (
    <>
      <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <MessageSquare size={24} /> Comments Moderation
      </h1>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 24, color: "#555" }}>Loading...</p>
        ) : comments.length === 0 ? (
          <p style={{ padding: 24, color: "#555" }}>No comments yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#666", fontSize: 12, borderBottom: "1px solid #2a2a2a", background: "#111" }}>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>Comment</th>
                <th style={{ textAlign: "left", padding: "12px 16px" }}>Video ID</th>
                <th style={{ textAlign: "right", padding: "12px 16px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(c => (
                <tr key={c.id} style={{ borderBottom: "1px solid #1f1f1f", fontSize: 14 }}>
                  <td style={{ padding: "12px 16px", color: "#ccc", whiteSpace: "nowrap" }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: "#aaa", maxWidth: 400 }}>{c.text}</td>
                  <td style={{ padding: "12px 16px", color: "#555", fontSize: 12 }}>
                    <a href={`/video/${c.videoId}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>{c.videoId}</a>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button onClick={() => deleteComment(c.id)}
                      style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <Trash2 size={12} /> Delete
                    </button>
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
