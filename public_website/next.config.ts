// Touch to trigger rebuild
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyc.cloud.appwrite.io",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
