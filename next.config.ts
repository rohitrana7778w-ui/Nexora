import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // process.cwd() is the project root when running `next dev` / `next build`.
  // (The old import.meta.url + __dirname code crashed config loading.)
  outputFileTracingRoot: process.cwd(),
  experimental: {
    // Stops the dev-only "Could not validate that a segment has instant navigation"
    // / "Dropped segment" warnings. Only pages that explicitly export `instant` are checked.
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
};

export default nextConfig;