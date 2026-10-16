import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  describeMessage,
  normalizeRecipient,
  parseWebhook,
  verifySignature,
  verifyToken,
  type InboundMessage,
} from "@/lib/whatsapp";

const secret = "app-secret";
const sign = (body: string) => `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

describe("verifySignature", () => {
  const body = JSON.stringify({ object: "whatsapp_business_account" });
  it("accepts Meta's signature over the exact bytes", () => {
    expect(verifySignature(body, sign(body), secret)).toBe(true);
  });
  it("rejects a forged, missing or malformed signature", () => {
    expect(verifySignature(body, sign(`${body} `), secret)).toBe(false);
    expect(verifySignature(body, null, secret)).toBe(false);
    expect(verifySignature(body, "sha1=abc", secret)).toBe(false);
    expect(verifySignature(body, "sha256=short", secret)).toBe(false);
  });
});

describe("verifyToken", () => {
  it("matches only the exact token", () => {
    expect(verifyToken("token", "token")).toBe(true);
    expect(verifyToken("Token", "token")).toBe(false);
    expect(verifyToken("toke", "token")).toBe(false);
    expect(verifyToken(null, "token")).toBe(false);
  });
});

describe("normalizeRecipient", () => {
  it("keeps digits only", () => {
    expect(normalizeRecipient("+20 100 220-0337")).toBe("201002200337");
  });
});

describe("parseWebhook", () => {
  const message: InboundMessage = {
    from: "201000000000",
    id: "wamid.1",
    timestamp: "1",
    type: "text",
    text: { body: "Hello" },
  };

  it("flattens messages with the sender's profile name and statuses", () => {
    const result = parseWebhook({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: "pn1", display_phone_number: "+1 555" },
                contacts: [{ wa_id: "201000000000", profile: { name: "Mona" } }],
                messages: [message],
                statuses: [{ id: "s1", status: "failed", timestamp: "2", recipient_id: "x" }],
              },
            },
          ],
        },
      ],
    });
    expect(result.messages).toEqual([
      { message, profileName: "Mona", phoneNumberId: "pn1", displayPhoneNumber: "+1 555" },
    ]);
    expect(result.statuses).toEqual([
      { id: "s1", status: "failed", timestamp: "2", recipient_id: "x", phoneNumberId: "pn1" },
    ]);
  });

  it.each([null, {}, { object: "page" }, { object: "whatsapp_business_account", entry: [{}] }])(
    "returns nothing for %j",
    (payload) => {
      expect(parseWebhook(payload)).toEqual({ messages: [], statuses: [] });
    },
  );
});

describe("describeMessage", () => {
  const base = { from: "1", id: "x", timestamp: "1" };
  it.each<[Partial<InboundMessage>, string]>([
    [{ type: "text", text: { body: "Hi" } }, "Hi"],
    [{ type: "image", image: { caption: "menu" } }, "[image] menu"],
    [{ type: "document", document: { filename: "a.pdf" } }, "[document a.pdf]"],
    [{ type: "document", document: {} }, "[document]"],
    [{ type: "location", location: { latitude: 31.2, longitude: 29.9 } }, "[location 31.2,29.9]"],
    [{ type: "interactive", interactive: { button_reply: { id: "1", title: "Yes" } } }, "Yes"],
    [{ type: "audio" }, "[voice note / audio]"],
    [{ type: "unsupported" }, "[unsupported]"],
  ])("renders %j as %s", (m, expected) => {
    expect(describeMessage({ ...base, ...m } as InboundMessage)).toBe(expected);
  });
});
