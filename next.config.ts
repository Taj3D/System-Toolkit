import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow cross-origin requests from preview domains
  allowedDevOrigins: [
    'preview-chat-d48c9af9-6f2d-4ca5-9036-1ec83aa927fd.space-z.ai',
    '.space-z.ai',
    'localhost',
    '21.0.9.70'
  ],
};

export default nextConfig;
