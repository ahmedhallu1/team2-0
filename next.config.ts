import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Several lockfiles exist above this directory (git worktrees), so pin the
  // workspace root explicitly instead of letting Turbopack infer the wrong one.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
