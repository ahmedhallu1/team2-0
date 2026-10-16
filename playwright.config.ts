import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests against a production build (`npm run build` first).
 *
 * Runs on the locally installed Google Chrome by default, so no browser
 * download is needed; set PW_CHANNEL= (empty) to use Playwright's bundled
 * Chromium instead, e.g. in CI after `npx playwright install chromium`.
 *
 * The server loads .env.local like any `next start`, so no test ever posts a
 * *valid* inquiry to /api/contact — the success path is intercepted in the
 * browser, and the API is only ever sent bodies it must reject.
 */
const PORT = Number(process.env.PORT ?? 3200);
const channel = process.env.PW_CHANNEL ?? "chrome";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    ...(channel ? { channel } : {}),
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, ...(channel ? { channel } : {}) } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(channel ? { channel } : {}) } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
