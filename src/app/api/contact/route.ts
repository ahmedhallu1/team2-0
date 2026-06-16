import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  service?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** RFC 2047 encoded-word so non-ASCII subjects survive. */
function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID as string,
      client_secret: process.env.GMAIL_CLIENT_SECRET as string,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN as string,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(
      `token: ${data.error ?? res.status} ${data.error_description ?? ""}`.trim(),
    );
  }
  return data.access_token;
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  // Honeypot: silently accept (and drop) anything that fills the hidden field.
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();
  const company = (data.company ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const service = (data.service ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Your message is a little too long." },
      { status: 400 },
    );
  }

  const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_SENDER,
    CONTACT_TO,
  } = process.env;

  if (
    !GMAIL_CLIENT_ID ||
    !GMAIL_CLIENT_SECRET ||
    !GMAIL_REFRESH_TOKEN ||
    !GMAIL_SENDER
  ) {
    console.error(
      "[contact] Missing Gmail env vars. See .env.example and scripts/get-gmail-refresh-token.mjs",
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "The contact form isn't fully configured yet. Please try again later.",
      },
      { status: 503 },
    );
  }

  const to = CONTACT_TO || "info@elevate2point0.com";

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Phone", phone || "—"],
    ["Service", service || "—"],
  ];

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;background:#081427;color:#eaf0fb;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
      <div style="padding:24px 28px;background:linear-gradient(100deg,#1e4fd1,#0b1a33)">
        <div style="font-size:22px;font-weight:800;font-family:Georgia,serif">
          <span style="color:#4f7bf0">2</span><span style="color:#d4a437">.0</span>
        </div>
        <div style="font-size:11px;letter-spacing:3px;color:#93a4c0;text-transform:uppercase;margin-top:4px">New website inquiry</div>
      </div>
      <div style="padding:24px 28px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:8px 0;color:#93a4c0;width:120px;vertical-align:top">${k}</td>
              <td style="padding:8px 0;color:#eaf0fb">${escapeHtml(v)}</td>
            </tr>`,
            )
            .join("")}
        </table>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08)">
          <div style="color:#93a4c0;font-size:14px;margin-bottom:8px">Message</div>
          <div style="white-space:pre-wrap;line-height:1.6;color:#eaf0fb;font-size:14px">${escapeHtml(
            message,
          )}</div>
        </div>
      </div>
    </div>`;

  // Build a raw RFC 2822 message for the Gmail API.
  const subject = `New inquiry from ${name}${company ? ` · ${company}` : ""}`;
  const mime = [
    `From: "2.0 Website" <${GMAIL_SENDER}>`,
    `To: ${to}`,
    `Reply-To: ${email}`,
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html, "utf8").toString("base64"),
  ].join("\r\n");

  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: base64url(mime) }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact] Gmail API send failed:", res.status, detail);
      return NextResponse.json(
        {
          ok: false,
          error: "We couldn't send your message right now. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send your message right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
