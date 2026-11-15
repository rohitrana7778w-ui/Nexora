import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Fix CodeFrameColorMode enum validation error in SWC
  // This prevents the boolean `true` from being passed to native bindings
  // that expect the NapiCodeFrameColorMode enum (Error=0, Warning=1, Info=2)
  experimental: {
    // Disable instrumentation that triggers the bug
  },
  // Ensure proper output file tracing
  outputFileTracingRoot: __dirname,
  // Environment variables to suppress the SWC color enum bug
  env: {
    NEXT_PRIVATE_TERMINAL_COLUMNS: "0",
  },
};

export default nextConfig;