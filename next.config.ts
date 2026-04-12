import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Keep canvas and gif-encoder-2 as Node.js external packages
  // Prevents Next.js from bundling them into the Edge Runtime
  serverExternalPackages: ["canvas", "gif-encoder-2"],

  // Empty turbopack config tells Next.js 16 we're aware of the webpack config
  // Canvas externalization is handled by serverExternalPackages above
  turbopack: {},

  // Webpack config for canvas native module (used when --webpack flag is passed)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        { canvas: "commonjs canvas" },
      ];
    }
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  // Ensure GIF API routes are never statically cached
  async headers() {
    return [
      {
        source: "/api/countdown/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
