import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-tweet'],
  images: {
     minimumCacheTTL: 604800
  }
};

export default nextConfig;
