import { expect, test } from "@playwright/test";
import { proposalRoutes, siteRoutes } from "./helpers";

const ORIGIN = "https://elevate2point0.com";
const KUPHUB = { host: "kuphub.elevate2point0.com" };

test.describe("metadata", () => {
  test.skip(({ isMobile }) => isMobile, "markup is the same at every width");

  for (const route of siteRoutes) {
    test(`${route} has its own canonical, a description and a share card`, async ({ page }) => {
      await page.goto(route);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical?.replace(/\/$/, "")).toBe(`${ORIGIN}${route}`.replace(/\/$/, ""));
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new RegExp(`^${ORIGIN}/`));
      await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    });
  }

  for (const route of proposalRoutes) {
    test(`${route} is private: noindex, and a share preview`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    });
  }

  test("the RMZtech proposal carries no 2.0 manifest", async ({ page }) => {
    await page.goto("/proposals/geoarabia");
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(0);
  });

  test("the home page publishes structured data", async ({ page }) => {
    await page.goto("/");
    const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(json).toMatchObject({ "@type": "ProfessionalService", name: "2.0", url: `${ORIGIN}/` });
  });
});

test.describe("crawler files", () => {
  test("robots.txt points at the production sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(body).toContain("Disallow: /api/");
  });

  test("the sitemap lists every public 2.0 page and nothing private", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of siteRoutes) expect(xml).toContain(`<loc>${ORIGIN}${route === "/" ? "/" : route}</loc>`);
    expect(xml).not.toContain("/proposals");
    expect(xml).not.toContain("/kuphub");
  });

  test("the manifest has installable raster icons", async ({ request }) => {
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
    for (const icon of manifest.icons) expect((await request.get(icon.src)).status()).toBe(200);
  });
});

test.describe("kuphub.elevate2point0.com", () => {
  test("serves KUPHUB at its root, and KUPHUB's own 404", async ({ request }) => {
    const home = await request.get("/", { headers: KUPHUB });
    expect(await home.text()).toContain("KUPHUB");

    const missing = await request.get("/no-such-page", { headers: KUPHUB });
    expect(missing.status()).toBe(404);
    const html = await missing.text();
    expect(html).toContain("This kup is empty");
    expect(html).not.toContain("didn’t make the 2.0");
  });

  test("has its own manifest, not 2.0's", async ({ request }) => {
    const manifest = await (await request.get("/kuphub/site.webmanifest", { headers: KUPHUB })).json();
    expect(manifest).toMatchObject({ short_name: "KUPHUB", start_url: "/" });
  });

  test("folds 2.0's pages back to KUPHUB's home", async ({ request }) => {
    const res = await request.get("/about", { headers: KUPHUB, maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toMatch(/\/$/);
  });

  test("sends phones from /app to their store", async ({ request }) => {
    const iphone = await request.get("/app", {
      headers: { ...KUPHUB, "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" },
      maxRedirects: 0,
    });
    expect(iphone.headers().location).toContain("apps.apple.com");
    const android = await request.get("/app", {
      headers: { ...KUPHUB, "user-agent": "Mozilla/5.0 (Linux; Android 15; Pixel 9)" },
      maxRedirects: 0,
    });
    expect(android.headers().location).toContain("play.google.com");
  });
});
