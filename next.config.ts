import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typedRoutes: true,
  allowedDevOrigins: ["*.fly.dev"],
};

export default nextConfig;
