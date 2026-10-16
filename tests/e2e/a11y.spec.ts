import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { siteRoutes } from "./helpers";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const scheme of ["dark", "light"] as const) {
  test.describe(`${scheme} theme`, () => {
    test.use({ colorScheme: scheme, reducedMotion: "reduce" });

    for (const route of [...siteRoutes, "/not-a-page"]) {
      test(`${route} has no axe violations`, async ({ page }) => {
        await page.goto(route);
        const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
      });
    }

    test("KUPHUB's site has no axe violations", async ({ page }) => {
      await page.goto("/kuphub");
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });
  });
}
