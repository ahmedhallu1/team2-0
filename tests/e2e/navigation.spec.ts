import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });

  test("opens as a modal, traps focus, closes on Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();

    const sheet = page.getByRole("dialog", { name: "Site menu" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("link", { name: /Home/ })).toBeFocused();

    // Tab around the whole ring and stay inside the sheet + its close button.
    const close = page.getByRole("button", { name: "Close menu" });
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        return Boolean(
          active &&
            (document.getElementById("mobile-menu")?.contains(active) ||
              active.getAttribute("aria-controls") === "mobile-menu"),
        );
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await expect(close).toHaveCount(0);
  });

  test("navigating closes the sheet and marks the page current", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: /Services/ }).click();
    await expect(page).toHaveURL("/services");
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog").getByRole("link", { name: /Services/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop navigation");

  test("the dock marks the current route and navigates client-side", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header.dock");
    await nav.getByRole("link", { name: "Work", exact: true }).click();
    await expect(page).toHaveURL("/work");
    await expect(nav.getByRole("link", { name: "Work", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Home", exact: true })).not.toHaveAttribute("aria-current", "page");
  });

  test("skip link jumps to the main content", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("theme", () => {
  test.use({ colorScheme: "dark", reducedMotion: "reduce" });

  test("the toggle switches theme and it survives a reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(html).toHaveClass(/(^|\s)light(\s|$)/);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.reload();
    await expect(html).toHaveClass(/(^|\s)light(\s|$)/);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(bg);
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  });
});
