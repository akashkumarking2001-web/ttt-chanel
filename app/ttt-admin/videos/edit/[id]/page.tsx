"use client";
import { useState, useRef, useEffect, use } from "react";
import { Upload, Link2, PlayCircle, CloudUpload } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["news","money","parttime","online","lifetime","mobile","apps"];
type VideoType = "youtube" | "cloudflare" | "blogger" | "post";

export default function EditVideo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionTa, setDescriptionTa] = useState("");
  const [category, setCategory] = useState("mobile");
  const [videoType, setVideoType] = useState<VideoType>("youtube");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [duration, setDuration] = useState("");
  const [links, setLinks] = useState([{ label: "", url: "" }]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/videos?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || "");
        setTitleTa(data.titleTa || "");
        setDescription(data.description || "");
        setDescriptionTa(data.descriptionTa || "");
        setCategory(data.category || "mobile");
        setVideoType(data.videoType || "youtube");
        setVideoUrl(data.videoUrl || "");
        setThumbnail(data.thumbnail || "");
        setDuration(data.duration || "");
        setLinks(data.links?.length ? data.links : [{ label: "", url: "" }]);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load video");
        setLoading(false);
      });
  }, [id]);

  // Upload to R2 via API
  const uploadToR2 = async (file: File, type: "video" | "thumb"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json() as { url?: string; error?: string };
    if (!data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(10);
    try {
      const interval = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 500);
      const url = await uploadToR2(file, "video");
      clearInterval(interval);
      setProgress(100);
      setVideoUrl(url);
      setVideoType("blogger");
      toast.success("Video uploaded to R2!");
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToR2(file, "thumb");
      setThumbnail(url);
      toast.success("Thumbnail uploaded!");
    } catch { toast.error("Thumbnail upload failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl && videoType !== "post") { toast.error("Please add a video URL or upload a video"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/videos?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, titleTa, description, descriptionTa, category, videoType, videoUrl,
          thumbnail, duration,
          links: links.filter(l => l.label && l.url),
        }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        toast.success("Video updated successfully!");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch { toast.error("Failed to save video"); }
    setSaving(false);
  };

  const addLink = () => setLinks(l => [...l, { label: "", url: "" }]);
  const updateLink = (i: number, k: "label" | "url", v: string) => setLinks(l => l.map((lnk, idx) => idx === i ? { ...lnk, [k]: v } : lnk));
  const removeLink = (i: number) => setLinks(l => l.filter((_, idx) => idx !== i));

  if (loading) return <div style={{ color: "white", padding: 40 }}>Loading...</div>;

  return (
    <>
      <h1 className="admin-page-title">✏️ Edit Video</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left column */}
          <div>
            <div className="admin-card">
              <h3 style={{ color: "white", marginBottom: 16 }}>📝 Video Details</h3>
              <div className="form-group">
                <label className="form-label">Title (English) *</label>
                <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Video title in English" id="video-title" />
              </div>
              <div className="form-group">
                <label className="form-label">Title (Tamil)</label>
                <input className="form-input" value={titleTa} onChange={e => setTitleTa(e.target.value)} placeholder="தமிழில் தலைப்பு" id="video-title-ta" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} id="video-category">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (e.g. 5:30)</label>
                <input className="form-input" value={duration} onChange={e => setDuration(e.target.value)} placeholder="5:30" id="video-duration" />
              </div>
            </div>

            <div className="admin-card">
              <h3 style={{ color: "white", marginBottom: 16 }}>🔗 Useful Links</h3>
              {links.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input className="form-input" value={l.label} onChange={e => updateLink(i, "label", e.target.value)} placeholder="Button label" style={{ flex: 1 }} />
                  <input className="form-input" value={l.url} onChange={e => updateLink(i, "url", e.target.value)} placeholder="https://..." style={{ flex: 2 }} />
                  <button type="button" onClick={() => removeLink(i)} style={{ color: "#ef4444", background: "none", fontSize: 18, padding: "0 8px" }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addLink} style={{ color: "#e94560", background: "none", fontSize: 14, marginTop: 4 }}>+ Add Link</button>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="admin-card">
              <h3 style={{ color: "white", marginBottom: 16 }}>📹 Video Source *</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {([["youtube", "YouTube", <PlayCircle key="y" size={16} />], ["cloudflare", "Cloudflare", <CloudUpload key="c" size={16} />], ["blogger", "Direct URL", <Link2 key="b" size={16} />], ["post", "Blog Post", <Upload key="p" size={16} />]] as const).map(([t, l, icon]) => (
                  <button key={t} type="button" onClick={() => setVideoType(t as VideoType)}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: videoType === t ? "#e94560" : "#111", color: videoType === t ? "white" : "#888", border: `1px solid ${videoType === t ? "#e94560" : "#333"}` }}>
                    {icon} {l}
                  </button>
                ))}
              </div>

              {videoType === "post" ? (
                <div style={{ background: "#1a1a1a", border: "1px dashed #333", borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 13, color: "#888", textAlign: "center" }}>
                  This is published as a Blog Post without a video.
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">
                    {videoType === "youtube" ? "YouTube URL" : videoType === "cloudflare" ? "Cloudflare Stream URL" : "Video Direct URL"}
                  </label>
                  <input className="form-input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="URL..." id="video-url" />
                </div>
              )}

              {videoType !== "post" && (
                <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 12, marginTop: 4 }}>
                  <label className="form-label">— OR — Upload to Cloudflare R2</label>
                  <input ref={fileRef} type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: "none" }} id="video-file-input" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary" style={{ background: "#6366f1", display: "flex", alignItems: "center", gap: 8 }} disabled={uploading}>
                    <Upload size={16} /> {uploading ? `Uploading ${progress}%...` : "Upload New Video File"}
                  </button>
                  {uploading && <div style={{ marginTop: 8, height: 4, background: "#333", borderRadius: 2 }}><div style={{ height: "100%", width: `${progress}%`, background: "#e94560", borderRadius: 2, transition: "width 0.3s" }} /></div>}
                </div>
              )}
            </div>

            <div className="admin-card">
              <h3 style={{ color: "white", marginBottom: 16 }}>🖼️ Thumbnail</h3>
              <div className="form-group">
                <label className="form-label">Thumbnail URL</label>
                <input className="form-input" value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." id="thumb-url" />
              </div>
              <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbUpload} style={{ display: "none" }} id="thumb-file-input" />
              <button type="button" onClick={() => thumbRef.current?.click()} style={{ color: "#e94560", background: "none", fontSize: 13, marginBottom: 12 }}>
                <Upload size={14} style={{ display: "inline", marginRight: 6 }} />Upload New Image to R2
              </button>
              {thumbnail && <img src={thumbnail} alt="Thumbnail preview" style={{ width: "100%", borderRadius: 8, marginTop: 8, objectFit: "cover", maxHeight: 160 }} />}
            </div>
          </div>
        </div>

        {/* Descriptions - full width */}
        <div className="admin-card">
          <h3 style={{ color: "white", marginBottom: 16 }}>📖 Blog Description</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description (English)</label>
              <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Write your blog content here in English..." style={{ minHeight: 200 }} id="desc-en" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description (Tamil)</label>
              <textarea className="form-textarea" value={descriptionTa} onChange={e => setDescriptionTa(e.target.value)} placeholder="தமிழில் விவரம் எழுதுங்க..." style={{ minHeight: 200 }} id="desc-ta" />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} disabled={saving} id="publish-btn">
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>
      </form>
    </>
  );
}
