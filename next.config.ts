import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  // turbopack is a top-level key in Next.js 15+/16, not under experimental.
  // Setting root silences the multiple-lockfile warning (stray pnpm-lock.yaml at C:\Users\Admin).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
