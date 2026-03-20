import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/render": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
