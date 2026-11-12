import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: true,
};
export default nextConfig;
