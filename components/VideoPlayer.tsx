"use client";

interface VideoPlayerProps {
  videoType: "youtube" | "cloudflare" | "blogger";
  videoUrl: string;
  title: string;
}

function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : url;
}

function getCloudflareId(url: string): string {
  // Cloudflare stream URL: https://customer-xxx.cloudflarestream.com/VIDEO_ID/iframe
  const match = url.match(/cloudflarestream\.com\/([^/]+)/);
  return match ? match[1] : url;
}

export default function VideoPlayer({ videoType, videoUrl, title }: VideoPlayerProps) {
  return (
    <div className="player-wrap">
      {videoType === "youtube" && (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {videoType === "cloudflare" && (
        <iframe
          src={`https://customer-${getCloudflareId(videoUrl)}.cloudflarestream.com/${getCloudflareId(videoUrl)}/iframe?autoplay=true`}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
      {videoType === "blogger" && (
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0, background: "#000" }}
          title={title}
        />
      )}
    </div>
  );
}
