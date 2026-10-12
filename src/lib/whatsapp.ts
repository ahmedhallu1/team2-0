/**
 * WhatsApp Business Platform (Meta Cloud API) — server-side helpers.
 *
 * Everything here runs on the server only: it reads secrets from the
 * environment and must never be imported from a client component.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Graph API version. Matches the version Meta's dashboard shows for the 2.0 app. */
const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || "v25.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

// ── Webhook payload shapes (only the fields we read) ──────────────────────

export type InboundMessage = {
  /** Sender's WhatsApp id — their phone number in E.164 digits, no "+". */
  from: string;
  /** wamid.… — unique per message. */
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  button?: { text: string; payload?: string };
  interactive?: {
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  image?: { caption?: string };
  document?: { caption?: string; filename?: string };
  video?: { caption?: string };
  location?: { latitude: number; longitude: number; name?: string };
};

export type StatusUpdate = {
  id: string;
  status: "sent" | "delivered" | "read" | "failed" | string;
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title?: string; message?: string }>;
};

type WebhookPayload = {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        metadata?: { display_phone_number?: string; phone_number_id?: string };
        contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
        messages?: InboundMessage[];
        statuses?: StatusUpdate[];
      };
    }>;
  }>;
};

export type InboundEvent = {
  message: InboundMessage;
  /** Profile name the customer set on their own WhatsApp, if shared. */
  profileName?: string;
  /** Which of our numbers received it. */
  phoneNumberId?: string;
  displayPhoneNumber?: string;
};

export type StatusEvent = StatusUpdate & { phoneNumberId?: string };

/** Flatten a webhook delivery into the messages and delivery receipts in it. */
export function parseWebhook(payload: unknown): {
  messages: InboundEvent[];
  statuses: StatusEvent[];
} {
  const messages: InboundEvent[] = [];
  const statuses: StatusEvent[] = [];
  const body = payload as WebhookPayload;
  if (body?.object !== "whatsapp_business_account") return { messages, statuses };

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages" || !change.value) continue;
      const { metadata, contacts, messages: msgs, statuses: sts } = change.value;
      for (const message of msgs ?? []) {
        const contact = contacts?.find((c) => c.wa_id === message.from);
        messages.push({
          message,
          profileName: contact?.profile?.name,
          phoneNumberId: metadata?.phone_number_id,
          displayPhoneNumber: metadata?.display_phone_number,
        });
      }
      for (const status of sts ?? []) {
        statuses.push({ ...status, phoneNumberId: metadata?.phone_number_id });
      }
    }
  }
  return { messages, statuses };
}

/** A short human-readable rendering of whatever the customer sent. */
export function describeMessage(m: InboundMessage): string {
  switch (m.type) {
    case "text":
      return m.text?.body ?? "";
    case "button":
      return m.button?.text ?? "[button]";
    case "interactive":
      return (
        m.interactive?.button_reply?.title ??
        m.interactive?.list_reply?.title ??
        "[interactive reply]"
      );
    case "image":
      return `[image]${m.image?.caption ? ` ${m.image.caption}` : ""}`;
    case "video":
      return `[video]${m.video?.caption ? ` ${m.video.caption}` : ""}`;
    case "document":
      return `[document ${m.document?.filename ?? ""}]${
        m.document?.caption ? ` ${m.document.caption}` : ""
      }`.replace(" ]", "]");
    case "location":
      return m.location
        ? `[location ${m.location.latitude},${m.location.longitude}${
            m.location.name ? ` ${m.location.name}` : ""
          }]`
        : "[location]";
    case "audio":
      return "[voice note / audio]";
    case "sticker":
      return "[sticker]";
    case "reaction":
      return "[reaction]";
    default:
      return `[${m.type}]`;
  }
}

// ── Webhook security ──────────────────────────────────────────────────────

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Validate Meta's `X-Hub-Signature-256` header: HMAC-SHA256 of the *raw*
 * request body keyed with the app secret. Must be given the exact bytes Meta
 * sent, so read the body as text before parsing it.
 */
export function verifySignature(
  rawBody: string,
  header: string | null,
  appSecret: string,
): boolean {
  if (!header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  return safeEqual(header.slice("sha256=".length), expected);
}

/** Constant-time check of the subscription verify token Meta sends on setup. */
export function verifyToken(provided: string | null, expected: string): boolean {
  return provided !== null && safeEqual(provided, expected);
}

// ── Sending ───────────────────────────────────────────────────────────────

export type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; status: number; error: string };

export function isConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
  );
}

/** Strip everything but digits: "+20 100 220 0337" → "201002200337". */
export function normalizeRecipient(raw: string): string {
  return raw.replace(/\D/g, "");
}

async function graphPost(
  path: string,
  body: Record<string, unknown>,
): Promise<SendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    return { ok: false, status: 503, error: "WHATSAPP_ACCESS_TOKEN is not set." };
  }
  try {
    const res = await fetch(`${GRAPH}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      messages?: Array<{ id: string }>;
      success?: boolean;
      error?: { message?: string; code?: number; error_data?: { details?: string } };
    };
    if (!res.ok) {
      const detail = data.error?.error_data?.details ?? data.error?.message;
      return {
        ok: false,
        status: res.status,
        error: `${data.error?.code ?? res.status}: ${detail ?? "Graph API error"}`,
      };
    }
    return { ok: true, messageId: data.messages?.[0]?.id ?? "" };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

function messagesPath(): string | null {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return id ? `${id}/messages` : null;
}

/**
 * Free-form text. WhatsApp only delivers this inside the 24-hour customer
 * service window — i.e. within 24h of the customer's last message to us.
 * Outside it you must use a pre-approved template (`sendTemplate`).
 */
export async function sendText(to: string, body: string): Promise<SendResult> {
  const path = messagesPath();
  if (!path) return { ok: false, status: 503, error: "WHATSAPP_PHONE_NUMBER_ID is not set." };
  return graphPost(path, {
    to: normalizeRecipient(to),
    type: "text",
    text: { body, preview_url: false },
  });
}

/** Send a pre-approved template — the only way to start a conversation. */
export async function sendTemplate(
  to: string,
  name: string,
  languageCode: string,
  bodyParams: string[] = [],
): Promise<SendResult> {
  const path = messagesPath();
  if (!path) return { ok: false, status: 503, error: "WHATSAPP_PHONE_NUMBER_ID is not set." };
  return graphPost(path, {
    to: normalizeRecipient(to),
    type: "template",
    template: {
      name,
      language: { code: languageCode },
      ...(bodyParams.length > 0
        ? {
            components: [
              {
                type: "body",
                parameters: bodyParams.map((text) => ({ type: "text", text })),
              },
            ],
          }
        : {}),
    },
  });
}

/** Show the customer the blue ticks for a message we've handled. */
export async function markRead(messageId: string): Promise<SendResult> {
  const path = messagesPath();
  if (!path) return { ok: false, status: 503, error: "WHATSAPP_PHONE_NUMBER_ID is not set." };
  return graphPost(path, { status: "read", message_id: messageId });
}
