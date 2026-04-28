import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
    {
      source: "/api/(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store" },
      ],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  org: "ghostos",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
});
