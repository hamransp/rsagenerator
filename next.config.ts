import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Disable server-side features
  typescript: {
    // Disable during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
