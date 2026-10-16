import { describe, expect, it } from "vitest";
import { PRODUCTION_URL, resolveSiteUrl } from "@/lib/site";

describe("resolveSiteUrl", () => {
  it("defaults to production", () => {
    expect(resolveSiteUrl(undefined).toString()).toBe(`${PRODUCTION_URL}/`);
    expect(resolveSiteUrl("   ").toString()).toBe(`${PRODUCTION_URL}/`);
  });
  it("honours a valid override", () => {
    expect(resolveSiteUrl(" https://preview.example.com ").origin).toBe(
      "https://preview.example.com",
    );
  });
  it("ignores malformed or non-web values", () => {
    expect(resolveSiteUrl("not a url").origin).toBe(PRODUCTION_URL);
    expect(resolveSiteUrl("javascript:alert(1)").origin).toBe(PRODUCTION_URL);
  });
});
