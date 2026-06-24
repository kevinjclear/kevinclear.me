import type { NextConfig } from "next";

// Static export: `next build` emits /out (HTML/CSS/JS) with no Node runtime —
// Caddy serves it on :8080 on the homelab VM, behind the existing nginx proxy.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
