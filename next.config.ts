import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    formats: ["image/webp"],
    unoptimized: true,
  },
};

export default nextConfig;
