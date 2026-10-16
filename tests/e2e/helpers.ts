import type { Page } from "@playwright/test";

/** 2.0's own routes — the ones every check below must pass on. */
export const siteRoutes = [
  "/",
  "/work",
  "/services",
  "/process",
  "/about",
  "/contact",
  "/privacy",
  "/data-deletion",
];

/** Client pages: served, but noindex and art-directed in the client's palette. */
export const proposalRoutes = ["/proposals/kuphub", "/proposals/geoarabia"];

/** Scroll like a person (wheel steps), all the way to the true bottom. */
export async function scrollToBottom(page: Page) {
  let last = -1;
  for (let i = 0; i < 400; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(40);
    const { y, max } = await page.evaluate(() => ({
      y: window.scrollY,
      max: document.documentElement.scrollHeight - window.innerHeight,
    }));
    if (y >= max - 2 && y === last) break;
    last = y;
  }
}

/** Collect console errors and uncaught exceptions for the life of the page. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    // A 404 page's own document request is expected to log this.
    if (/Failed to load resource: the server responded with a status of 404/.test(m.text())) return;
    errors.push(m.text());
  });
  return errors;
}
