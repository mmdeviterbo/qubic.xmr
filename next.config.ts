import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
     minimumCacheTTL: 604800
  }
};

export default nextConfig;
