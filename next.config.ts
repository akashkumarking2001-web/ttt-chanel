import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.youtube.com" },
      { protocol: "https", hostname: "**.ytimg.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
      { protocol: "https", hostname: "**.firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "**.blogger.com" },
      { protocol: "https", hostname: "**.bp.blogspot.com" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
  },
  output: "standalone",
};

export default nextConfig;
