import { describe, expect, it } from "vitest";
import { INQUIRY_LIMITS, parseInquiry, validateInquiry } from "@/lib/inquiry";

const valid = {
  name: "Mona Adel",
  email: "mona@example.com",
  company: "Acme",
  phone: "+20 100 000 0000",
  service: "Lead generation",
  message: "We want to sell into the Gulf.",
};

describe("parseInquiry", () => {
  it("accepts a complete inquiry and trims it", () => {
    const result = parseInquiry({ ...valid, name: "  Mona Adel  " });
    expect(result).toEqual({ ok: true, inquiry: valid });
  });

  it("treats a filled honeypot as spam, whatever else is sent", () => {
    expect(parseInquiry({ ...valid, website: "http://spam.example" })).toEqual({
      ok: true,
      spam: true,
    });
  });

  it.each([null, undefined, "text", 42, [], [valid]])(
    "rejects a non-object body (%j) without throwing",
    (body) => {
      const result = parseInquiry(body);
      expect(result.ok).toBe(false);
    },
  );

  it("ignores non-string field values instead of crashing", () => {
    const result = parseInquiry({ name: 5, email: {}, message: ["hi"] });
    expect(result).toMatchObject({
      ok: false,
      fields: { name: expect.any(String), email: expect.any(String), message: expect.any(String) },
    });
  });

  it("reports the first problem as the summary error", () => {
    const result = parseInquiry({ ...valid, email: "not-an-email" });
    expect(result).toEqual({
      ok: false,
      error: "That email address doesn’t look right.",
      fields: { email: "That email address doesn’t look right." },
    });
  });

  it("strips control characters, so a name can never split a header", () => {
    const result = parseInquiry({ ...valid, name: "Mona\r\nBcc: x@evil.example" });
    expect(result.ok && "inquiry" in result && result.inquiry.name).toBe(
      "Mona Bcc: x@evil.example",
    );
  });

  it("keeps line breaks in the message but normalises them", () => {
    const result = parseInquiry({ ...valid, message: "line one\r\nline two\u0007" });
    expect(result.ok && "inquiry" in result && result.inquiry.message).toBe(
      "line one\nline two",
    );
  });
});

describe("validateInquiry", () => {
  it.each(["a@b", "a b@c.com", "@example.com", "a@example.c"])(
    "rejects the email %s",
    (email) => {
      expect(validateInquiry({ ...valid, email }).email).toBeDefined();
    },
  );

  it.each(Object.keys(INQUIRY_LIMITS) as Array<keyof typeof INQUIRY_LIMITS>)(
    "enforces the %s length limit",
    (field) => {
      const limit = INQUIRY_LIMITS[field];
      const atLimit = field === "email" ? `${"a".repeat(limit - 12)}@example.com` : "x".repeat(limit);
      expect(validateInquiry({ ...valid, [field]: atLimit })[field]).toBeUndefined();
      const over = field === "email" ? `${"a".repeat(limit)}@example.com` : "x".repeat(limit + 1);
      expect(validateInquiry({ ...valid, [field]: over })[field]).toBeDefined();
    },
  );

  it("requires name, email and message but not the rest", () => {
    const errors = validateInquiry({ name: "", email: "", company: "", phone: "", service: "", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });
});
