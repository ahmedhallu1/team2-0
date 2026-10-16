import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Any /kuphub address nothing else claims — and, through the host rewrite in
 * next.config.ts, any unknown path on kuphub.elevate2point0.com. Without this
 * they fell through to 2.0's catch-all and showed 2.0's 404 on KUPHUB's site.
 */
/**
 * Declared here as well as on not-found.tsx: this is the route the client
 * resolves metadata for, so without it the title reverted to the layout's
 * default after hydration, and the layout's `index` robots tag rode along.
 */
export const metadata: Metadata = {
  title: "Page not found — KUPHUB",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function Missing() {
  notFound();
}
