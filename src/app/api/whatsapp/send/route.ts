import { NextResponse } from "next/server";
import {
  isConfigured,
  normalizeRecipient,
  sendTemplate,
  sendText,
  verifyToken,
} from "@/lib/whatsapp";

export const runtime = "nodejs";

type Body = {
  to?: string;
  /** Free-form text — only deliverable inside the 24h customer-service window. */
  text?: string;
  /** Pre-approved template — required to open a conversation. */
  template?: { name?: string; language?: string; params?: string[] };
};

/**
 * Outbound WhatsApp message, for 2.0's own services and the team.
 *
 * Authenticated with `Authorization: Bearer $WHATSAPP_SEND_SECRET`. If the
 * secret isn't configured the endpoint is closed — it must never be an open
 * relay that spends our WhatsApp conversation budget.
 */
export async function POST(req: Request) {
  const secret = process.env.WHATSAPP_SEND_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Sending is not enabled." },
      { status: 503 },
    );
  }
  const auth = req.headers.get("authorization") ?? "";
  const presented = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!verifyToken(presented, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "WhatsApp credentials are not configured." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const to = normalizeRecipient(body.to ?? "");
  // E.164 allows at most 15 digits; anything shorter than 8 isn't a real number.
  if (to.length < 8 || to.length > 15) {
    return NextResponse.json(
      { ok: false, error: "`to` must be a phone number in international format." },
      { status: 400 },
    );
  }

  let result;
  if (body.template?.name) {
    result = await sendTemplate(
      to,
      body.template.name,
      body.template.language || "en_US",
      body.template.params ?? [],
    );
  } else if (body.text?.trim()) {
    if (body.text.length > 4096) {
      return NextResponse.json(
        { ok: false, error: "`text` is limited to 4096 characters." },
        { status: 400 },
      );
    }
    result = await sendText(to, body.text);
  } else {
    return NextResponse.json(
      { ok: false, error: "Provide `text` or `template`." },
      { status: 400 },
    );
  }

  if (!result.ok) {
    console.error("[whatsapp] send failed:", result.status, result.error);
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status >= 400 && result.status < 500 ? 400 : 502 },
    );
  }
  return NextResponse.json({ ok: true, messageId: result.messageId });
}
