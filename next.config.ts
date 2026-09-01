import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "localhost", "127.0.0.1"],
  images: {
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/uploads/**" }],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
