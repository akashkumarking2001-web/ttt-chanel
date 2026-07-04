"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import LikeDislikeShare from "@/components/LikeDislikeShare";
import CommentSection from "@/components/CommentSection";
import VideoCard, { VideoDoc } from "@/components/VideoCard";
import { useApp } from "@/components/ClientRoot";
import { ExternalLink, Eye, Frown, FileText, Link2, Video } from "lucide-react";
import { use } from "react";

interface VideoData extends VideoDoc {
  description?: string;
  descriptionTa?: string;
  links?: { label: string; url: string }[];
  dislikes?: number;
  videoUrl: string;
}

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, t } = useApp();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [related, setRelated] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/videos?id=${id}`);
      if (res.ok) {
        const data = await res.json() as VideoData;
        setVideo(data);
        // Increment views
        fetch(`/api/videos?id=${id}&action=view`, { method: "PATCH" }).catch(() => {});
        // Fetch related
        const relRes = await fetch(`/api/videos?category=${data.category}&limit=6`);
        const relData = await relRes.json() as VideoDoc[];
        setRelated(Array.isArray(relData) ? relData.filter(v => v.id !== id).slice(0, 5) : []);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div className="video-page">
      <div className="video-main">
        <div className="player-wrap skeleton" style={{ background: "#111" }} />
        <div style={{ marginTop: 16 }}>
          <div className="skeleton skeleton-line" style={{ height: 24, marginBottom: 12 }} />
          <div className="skeleton skeleton-line short" />
        </div>
      </div>
    </div>
  );

  if (!video) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <Frown size={48} />
      </div>
      <p style={{ marginTop: 12 }}>{lang === "ta" ? "வீடியோ கிடைக்கவில்லை" : "Video not found"}</p>
    </div>
  );

  const title = lang === "ta" && video.titleTa ? video.titleTa : video.title;
  const desc = lang === "ta" && video.descriptionTa ? video.descriptionTa : video.description;

  return (
    <div className="video-page">
      <div className="video-main">
        <VideoPlayer videoType={video.videoType} videoUrl={video.videoUrl} title={title} />

        <div className="video-info">
          <h1 className="video-page-title">{title}</h1>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, color: "var(--text-muted)", fontSize: 13 }}>
            {video.views != null && <span><Eye size={14} style={{ display:"inline", marginRight:4 }} />{video.views.toLocaleString()} {t.video.views}</span>}
          </div>
          <LikeDislikeShare videoId={id} initialLikes={video.likes || 0} initialDislikes={video.dislikes || 0} />

          {desc && (
            <div className="video-description">
              <div className="desc-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={16} /> {t.video.description}
              </div>
              <div className="desc-content" dangerouslySetInnerHTML={{ __html: desc.replace(/\n/g, "<br/>").replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>') }} />
            </div>
          )}

          {video.links && video.links.length > 0 && (
            <div className="links-section">
              <div className="links-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link2 size={16} /> {t.video.links}
              </div>
              {video.links.map((lnk, i) => (
                <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                  <ExternalLink size={14} /> {lnk.label}
                </a>
              ))}
            </div>
          )}

          <CommentSection videoId={id} />
        </div>
      </div>

      <aside>
        {related.length > 0 && (
          <div className="sidebar-card">
            <div className="sidebar-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Video size={16} /> {t.video.relatedVideos}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {related.map(v => (
                <a key={v.id} href={`/video/${v.id}`} className="playlist-item">
                  <div className="playlist-thumb" style={{ background: "var(--bg-secondary)" }}>
                    {v.thumbnail ? <img src={v.thumbnail} alt={v.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <Video size={16} color="var(--primary)" />}
                  </div>
                  <div className="playlist-info">
                    <div className="playlist-name">{lang === "ta" && v.titleTa ? v.titleTa : v.title}</div>
                    <div className="playlist-count">{v.views?.toLocaleString() || 0} {t.video.views}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
