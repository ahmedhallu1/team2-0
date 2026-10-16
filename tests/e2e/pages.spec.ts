import { expect, test } from "@playwright/test";
import { proposalRoutes, scrollToBottom, siteRoutes, trackErrors } from "./helpers";

for (const route of [...siteRoutes, ...proposalRoutes, "/kuphub"]) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors = trackErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/\S/);
    expect(await page.locator("html").getAttribute("lang")).toBe("en");

    await scrollToBottom(page);

    // No sideways scroll at any width, and no broken images.
    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      brokenImages: [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
      missingAlt: [...document.images].filter((img) => !img.hasAttribute("alt")).length,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    expect(layout.brokenImages).toEqual([]);
    expect(layout.missingAlt).toBe(0);

    // Headings never skip a level on the way down.
    const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((els) =>
      els.map((el) => Number(el.tagName[1])),
    );
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i], `heading ${i} jumps from h${levels[i - 1]}`).toBeLessThanOrEqual(
        levels[i - 1] + 1,
      );
    }

    expect(errors).toEqual([]);
  });
}

test("internal links all resolve", async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of siteRoutes) {
    await page.goto(route);
    for (const href of await page.locator("a[href^='/']").evaluateAll((as) =>
      as.map((a) => a.getAttribute("href") ?? ""),
    )) {
      hrefs.add(href.split("#")[0] || "/");
    }
  }
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});

test("an unknown address gets 2.0's branded 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page not found/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("didn’t make the 2.0");
  // Next adds its own noindex beside ours; every robots tag must agree.
  const robots = await page.locator('meta[name="robots"]').evaluateAll((els) =>
    els.map((el) => el.getAttribute("content") ?? ""),
  );
  expect(robots.length).toBeGreaterThan(0);
  for (const content of robots) expect(content).toContain("noindex");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
});
