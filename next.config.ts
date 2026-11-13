import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // Production builds must not overwrite modules used by a running dev server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  output: "export",
  outputFileTracingRoot: process.cwd(),
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: true,
});
export default nextConfig;
