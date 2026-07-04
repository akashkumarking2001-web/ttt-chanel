"use client";
import { useState, useEffect } from "react";
import { getVisitorId, getVisitorName, setVisitorName } from "@/lib/visitor";
import { useApp } from "./ClientRoot";
import { MessageCircle, Send } from "lucide-react";

interface Comment { id: string; name: string; text: string; createdAt?: number; visitorId: string; }

function timeAgo(s: number) {
  const d = Math.floor((Date.now() / 1000 - s) / 60);
  if (d < 1) return "Just now";
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d/60)}h ago`;
  return `${Math.floor(d/1440)}d ago`;
}

export default function CommentSection({ videoId }: { videoId: string }) {
  const { t, lang } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [savedName, setSavedName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?videoId=${videoId}`);
      if (res.ok) {
        const data = await res.json() as Comment[];
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    const n = getVisitorName();
    setSavedName(n);
    if (n) setName(n);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !name.trim()) return;
    setSubmitting(true);
    try {
      if (!savedName) { setVisitorName(name); setSavedName(name); }
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          name: name.trim(),
          text: text.trim(),
          visitorId: getVisitorId(),
        }),
      });
      if (res.ok) {
        setText("");
        fetchComments();
      }
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  return (
    <div className="comments-section">
      <div className="comments-title"><MessageCircle size={18} style={{ display:"inline", marginRight:8 }} />{t.video.comments} ({comments.length})</div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-inputs">
          {!savedName && (
            <input className="comment-name-input" type="text" placeholder={t.video.yourName}
              value={name} onChange={e => setName(e.target.value)} required maxLength={50} id="comment-name" />
          )}
          <textarea className="comment-text-input" placeholder={t.video.addComment}
            value={text} onChange={e => setText(e.target.value)} required maxLength={500} id="comment-text" />
          <button type="submit" className="comment-submit" disabled={submitting} id="comment-submit">
            <Send size={14} style={{ marginRight: 6, display: "inline" }} />
            {submitting ? (lang === "ta" ? "போஸ்ட் ஆகுது..." : "Posting...") : t.video.post}
          </button>
        </div>
      </form>
      <div className="comment-list">
        {comments.map(c => (
          <div key={c.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-avatar">{c.name.charAt(0).toUpperCase()}</div>
              <span className="comment-name">{c.name}</span>
              {c.createdAt && <span className="comment-date">{timeAgo(c.createdAt)}</span>}
            </div>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0", fontSize: 14 }}>
            {lang === "ta" ? "முதல் கமெண்ட் போடுங்க!" : "Be the first to comment!"}
          </p>
        )}
      </div>
    </div>
  );
}
