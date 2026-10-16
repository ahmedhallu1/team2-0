/**
 * Where the site is served from — the one source for absolute URLs (metadata
 * base, canonical links, sitemap, robots, structured data).
 *
 * `NEXT_PUBLIC_SITE_URL` overrides it for previews; a missing or malformed
 * value falls back to production rather than to a stale deployment alias.
 */
export const PRODUCTION_URL = "https://elevate2point0.com";

export function resolveSiteUrl(raw = process.env.NEXT_PUBLIC_SITE_URL): URL {
  const value = raw?.trim();
  if (value) {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" || url.protocol === "http:") return url;
    } catch {
      // fall through to production
    }
  }
  return new URL(PRODUCTION_URL);
}

export const siteUrl = resolveSiteUrl();

/** The origin with no trailing slash, for string-built URLs. */
export const siteOrigin = siteUrl.origin;

/** An absolute URL for a site path. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
