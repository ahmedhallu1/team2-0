import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  const form = (page: import("@playwright/test").Page) => page.locator("#contact-form form");

  test("an empty submit is caught in the browser and points at the first field", async ({ page }) => {
    let posted = false;
    await page.route("**/api/contact", (route) => {
      posted = true;
      return route.abort();
    });
    await form(page).getByRole("button", { name: "Send message" }).click();

    const name = page.getByLabel("Name");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#name-error")).toHaveText("Please tell us your name.");
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#message-error")).toBeVisible();
    expect(posted).toBe(false);

    // Fixing a field clears its error straight away.
    await name.fill("Mona");
    await expect(page.locator("#name-error")).toHaveCount(0);
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
  });

  test("a malformed email is flagged on its own field", async ({ page }) => {
    await page.getByLabel("Name").fill("Mona");
    await page.getByLabel("Email").fill("mona@example");
    await page.getByLabel("Message").fill("Hello");
    await form(page).getByRole("button", { name: "Send message" }).click();
    await expect(page.getByLabel("Email")).toBeFocused();
    await expect(page.locator("#email-error")).toHaveText("That email address doesn’t look right.");
  });

  test("a successful send shows the confirmation and moves focus to it", async ({ page }) => {
    let payload: Record<string, string> = {};
    await page.route("**/api/contact", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.getByLabel("Name").fill("Mona Adel");
    await page.getByLabel("Email").fill("mona@example.com");
    await page.getByLabel("Service of interest").selectOption({ index: 2 });
    await expect(page.locator("#service-hint")).toBeVisible();
    await page.getByLabel("Message").fill("We want to sell into the Gulf.");
    await form(page).getByRole("button", { name: "Send message" }).click();

    const heading = page.getByRole("heading", { name: "Message sent" });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
    expect(payload).toMatchObject({ name: "Mona Adel", email: "mona@example.com", website: "" });

    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByLabel("Name")).toHaveValue("");
  });

  test("a server failure is explained and focused", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 502, json: { ok: false, error: "We couldn't send your message right now. Please try again." } }),
    );
    await page.getByLabel("Name").fill("Mona");
    await page.getByLabel("Email").fill("mona@example.com");
    await page.getByLabel("Message").fill("Hello");
    await form(page).getByRole("button", { name: "Send message" }).click();
    const alert = page.getByText("We couldn't send your message right now.");
    await expect(alert).toBeFocused();
  });

  test("a dropped connection gets a human message, not 'Failed to fetch'", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.abort("internetdisconnected"));
    await page.getByLabel("Name").fill("Mona");
    await page.getByLabel("Email").fill("mona@example.com");
    await page.getByLabel("Message").fill("Hello");
    await form(page).getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/couldn’t reach the server/)).toBeFocused();
  });

  test("inputs carry the server's length limits", async ({ page }) => {
    await expect(page.getByLabel("Message")).toHaveAttribute("maxlength", "5000");
    await expect(page.getByLabel("Name")).toHaveAttribute("maxlength", "120");
  });
});

test.describe("/api/contact", () => {
  // Every body here must be rejected — none may ever reach a mail provider.
  for (const [label, data] of [
    ["null", "null"],
    ["an array", "[]"],
    ["wrong types", JSON.stringify({ name: 5, email: {}, message: [] })],
    ["a bad email", JSON.stringify({ name: "A", email: "nope", message: "hi" })],
    ["a missing message", JSON.stringify({ name: "A", email: "a@example.com" })],
  ] as const) {
    test(`rejects ${label} with a 400`, async ({ request }) => {
      const res = await request.post("/api/contact", {
        data,
        headers: { "content-type": "application/json" },
      });
      expect(res.status()).toBe(400);
      expect(await res.json()).toMatchObject({ ok: false });
    });
  }

  test("rejects invalid JSON", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: "not json",
      headers: { "content-type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects posts from another website", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {},
      headers: { origin: "https://evil.example" },
    });
    expect(res.status()).toBe(403);
  });

  test("swallows honeypot submissions without sending", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { website: "http://spam.example", name: "x" },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
