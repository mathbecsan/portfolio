import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Animated page-to-page navigation (React <ViewTransition>, see layout.tsx + globals.css)
  experimental: { viewTransition: true },
};

export default nextConfig;
