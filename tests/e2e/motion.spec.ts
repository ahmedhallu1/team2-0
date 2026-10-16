import { expect, test } from "@playwright/test";
import { scrollToBottom, siteRoutes } from "./helpers";

/**
 * The regression that matters most: reveals below the fold must still
 * *animate* for a visitor who reads the first screen for a while. The old
 * safety net fired on a timer whenever scripting worked and froze them all.
 */
test("below-the-fold reveals still animate after a long first look", async ({ page }) => {
  await page.goto("/about");
  await page.waitForTimeout(5500); // past the 4s safety net

  expect(await page.locator("html").evaluate((el) => el.classList.contains("motion-fallback"))).toBe(false);

  const target = page.locator(".rise").last();
  // Still waiting below the fold: hidden by the CSS start state.
  expect(Number(await target.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.05);

  await scrollToBottom(page);
  await expect
    .poll(() => target.evaluate((el) => Number(getComputedStyle(el).opacity)))
    .toBeGreaterThan(0.99);
});

for (const route of siteRoutes) {
  test(`${route}: nothing is left hidden once scrolled through`, async ({ page }) => {
    await page.goto(route);
    await scrollToBottom(page);
    await page.waitForTimeout(2000);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll(".rise, .rise-group > *, .line-mask__inner, .curtain, .mark-resolve")]
        .filter((el) => {
          const s = getComputedStyle(el);
          return Number(s.opacity) < 0.5 || s.clipPath.includes("100%");
        })
        .map((el) => (el.textContent ?? "").trim().slice(0, 40)),
    );
    expect(hidden).toEqual([]);
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("everything is visible immediately, with no loader", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".preloader")).toBeHidden();
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll(".rise, .rise-group > *, .line-mask__inner")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.99,
      ).length,
    );
    expect(hidden).toBe(0);
  });
});

test("without JavaScript, all content is still visible", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/work");
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".rise, .rise-group > *")].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.99,
    ).length,
  );
  expect(hidden).toBe(0);
  await context.close();
});
