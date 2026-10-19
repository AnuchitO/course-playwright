import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Remove the X-Powered-By: Next.js fingerprinting header
  poweredByHeader: false,

  // No headers() here: `output: "export"` produces static files only —
  // there is no Next.js server to run headers() against, so it would be
  // dead/misleading config (Next.js itself warns and ignores it during
  // `next build`). Equivalent security headers (CSP, X-Frame-Options, etc.)
  // must be applied at the hosting/CDN layer instead, e.g. a CloudFront
  // Response Headers Policy — see app/web/docs/deploy-s3.md.
};

export default nextConfig;
