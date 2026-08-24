import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Reputation services — McAfee WebAdvisor among them — score a domain partly on
 * whether it behaves like a site that takes itself seriously. A young domain
 * serving no headers beyond HSTS reads as unmaintained; these are the standard
 * set, all safe for a static marketing site.
 *
 * Deliberately not here: a script-src CSP. Next injects its own inline
 * hydration scripts, so a real policy needs per-request nonces through the
 * proxy — worth doing, but not something to bolt on blind.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Several lockfiles exist above this directory (git worktrees), so pin the
  // workspace root explicitly instead of letting Turbopack infer the wrong one.
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
