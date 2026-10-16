import { describe, expect, it } from "vitest";
import { clientKey, createRateLimiter, isSameOrigin } from "@/lib/request-guard";

describe("createRateLimiter", () => {
  it("allows up to the limit per window, then blocks", () => {
    const allow = createRateLimiter({ limit: 3, windowMs: 1000 });
    const results = [0, 1, 2, 3, 4].map(() => allow("a", 0));
    expect(results).toEqual([true, true, true, false, false]);
  });

  it("keeps keys independent", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("b", 0)).toBe(true);
    expect(allow("a", 0)).toBe(false);
  });

  it("opens again once the window has passed", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 999)).toBe(false);
    expect(allow("a", 1000)).toBe(true);
  });

  it("stays bounded in memory", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 3 });
    for (const key of ["a", "b", "c", "d"]) allow(key, 0);
    // "a" was evicted to make room, so it starts a fresh window.
    expect(allow("a", 1)).toBe(true);
  });
});

describe("clientKey", () => {
  it("uses the first forwarded address", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
  });
  it("falls back to x-real-ip, then a shared bucket", () => {
    expect(clientKey(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
    expect(clientKey(new Headers())).toBe("unknown");
  });
});

describe("isSameOrigin", () => {
  it("allows requests with no Origin (server-to-server, curl)", () => {
    expect(isSameOrigin(new Headers({ host: "elevate2point0.com" }))).toBe(true);
  });
  it("allows the site's own pages", () => {
    expect(
      isSameOrigin(new Headers({ host: "elevate2point0.com", origin: "https://elevate2point0.com" })),
    ).toBe(true);
  });
  it("rejects other origins and garbage", () => {
    expect(
      isSameOrigin(new Headers({ host: "elevate2point0.com", origin: "https://evil.example" })),
    ).toBe(false);
    expect(isSameOrigin(new Headers({ host: "elevate2point0.com", origin: "null" }))).toBe(false);
  });
  it("prefers the forwarded host behind a proxy", () => {
    expect(
      isSameOrigin(
        new Headers({
          host: "internal:3000",
          "x-forwarded-host": "www.elevate2point0.com",
          origin: "https://www.elevate2point0.com",
        }),
      ),
    ).toBe(true);
  });
});
