import { expect, test } from "@playwright/test";

test("every response carries the security headers", async ({ request }) => {
  for (const path of ["/", "/kuphub", "/proposals/geoarabia", "/robots.txt"]) {
    const headers = (await request.get(path)).headers();
    expect(headers["x-content-type-options"], path).toBe("nosniff");
    expect(headers["x-frame-options"], path).toBe("SAMEORIGIN");
    expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"], path).toContain("max-age=");
    expect(headers["permissions-policy"], path).toContain("camera=()");
  }
});

test("the WhatsApp webhook fails closed", async ({ request }) => {
  const forged = await request.post("/api/whatsapp/webhook", {
    data: { object: "whatsapp_business_account" },
    headers: { "x-hub-signature-256": "sha256=forged" },
  });
  // 403 with a secret configured, 503 without one — never a 2xx.
  expect([403, 503]).toContain(forged.status());

  const handshake = await request.get(
    "/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=123",
  );
  expect([403, 503]).toContain(handshake.status());
});

test("the WhatsApp send API refuses unauthenticated calls", async ({ request }) => {
  const res = await request.post("/api/whatsapp/send", { data: { to: "201000000000", text: "hi" } });
  expect([401, 503]).toContain(res.status());
});
