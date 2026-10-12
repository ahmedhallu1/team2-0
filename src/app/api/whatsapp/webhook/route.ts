import { after } from "next/server";
import {
  describeMessage,
  isConfigured,
  markRead,
  parseWebhook,
  sendText,
  verifySignature,
  verifyToken,
  type InboundEvent,
  type StatusEvent,
} from "@/lib/whatsapp";

export const runtime = "nodejs";

/**
 * Meta WhatsApp webhook.
 *
 *   GET  — one-time subscription handshake (Meta calls it when you save the
 *          callback URL in the dashboard).
 *   POST — every inbound message and delivery receipt for the subscribed WABA.
 *
 * Meta expects a 2xx within seconds and retries on anything else, so the POST
 * handler validates, acknowledges, and does the real work in `after()`.
 */

export async function GET(req: Request) {
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!expected) {
    console.error("[whatsapp] WHATSAPP_VERIFY_TOKEN is not set.");
    return new Response("Not configured", { status: 503 });
  }

  const params = new URL(req.url).searchParams;
  const challenge = params.get("hub.challenge");
  if (
    params.get("hub.mode") === "subscribe" &&
    challenge !== null &&
    verifyToken(params.get("hub.verify_token"), expected)
  ) {
    // Meta wants the challenge echoed back verbatim as plain text.
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) {
    // Fail closed: without the secret we can't tell Meta from anyone else.
    console.error("[whatsapp] META_APP_SECRET is not set; rejecting delivery.");
    return new Response("Not configured", { status: 503 });
  }

  // The signature covers the exact bytes Meta sent — read text, parse after.
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"), appSecret)) {
    return new Response("Invalid signature", { status: 403 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { messages, statuses } = parseWebhook(payload);
  if (messages.length > 0 || statuses.length > 0) {
    after(() => handleDelivery(messages, statuses));
  }
  return new Response("OK", { status: 200 });
}

// ── Work done after the acknowledgement ──────────────────────────────────

async function handleDelivery(messages: InboundEvent[], statuses: StatusEvent[]) {
  for (const s of statuses) {
    // Delivery receipts are only interesting when something went wrong.
    if (s.status === "failed") {
      console.error(
        `[whatsapp] delivery failed to=${s.recipient_id} id=${s.id}`,
        JSON.stringify(s.errors ?? []),
      );
    }
  }
  for (const event of messages) {
    try {
      await handleInbound(event);
    } catch (err) {
      console.error("[whatsapp] failed handling inbound message:", err);
    }
  }
}

/** One auto-reply per customer per window, per warm instance (best effort). */
const AUTO_REPLY_WINDOW_MS = 6 * 60 * 60 * 1000;
const lastAutoReply = new Map<string, number>();

async function handleInbound({ message, profileName }: InboundEvent) {
  const text = describeMessage(message);
  const who = profileName ? `${profileName} (+${message.from})` : `+${message.from}`;
  console.log(
    `[whatsapp] inbound from=${message.from} type=${message.type} id=${message.id}`,
  );

  const emailed = await forwardToInbox(who, message.from, text);
  if (!emailed) {
    // No mail transport — the runtime log is the only place the team sees it.
    console.error(
      "[whatsapp] UNFORWARDED MESSAGE:",
      JSON.stringify({ from: message.from, name: profileName, text }),
    );
  }

  if (!isConfigured()) return;
  await markRead(message.id);

  const reply = env("WHATSAPP_AUTO_REPLY");
  if (!reply || message.type === "reaction") return;
  const now = Date.now();
  const last = lastAutoReply.get(message.from) ?? 0;
  if (now - last < AUTO_REPLY_WINDOW_MS) return;
  lastAutoReply.set(message.from, now);
  const sent = await sendText(message.from, reply);
  if (!sent.ok) console.error("[whatsapp] auto-reply failed:", sent.error);
}

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Mirror the message into the team inbox via Brevo (same transport as the
 * contact form). Returns false when it couldn't be sent, so the caller can
 * fall back to the log.
 */
async function forwardToInbox(
  who: string,
  from: string,
  text: string,
): Promise<boolean> {
  const apiKey = env("BREVO_API_KEY");
  if (!apiKey) return false;
  const brand = env("CONTACT_FROM") || "contact@elevate2point0.com";
  const sender = env("BREVO_SENDER") || brand;
  const to = env("CONTACT_TO") || brand;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "2.0 — WhatsApp", email: sender },
        to: [{ email: to }],
        subject: `WhatsApp from ${who}`,
        htmlContent: `<p style="font-family:sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
          text,
        )}</p><p style="font-family:sans-serif;font-size:13px;color:#666">Reply on WhatsApp: <a href="https://wa.me/${from}">wa.me/${from}</a></p>`,
      }),
    });
    if (!res.ok) {
      console.error("[whatsapp] inbox forward failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[whatsapp] inbox forward error:", err);
    return false;
  }
}
