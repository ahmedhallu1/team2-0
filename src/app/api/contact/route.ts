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

const BRAND_NAME = "2.0 — Elevate your vision";

/** The address we present as ours on the site and in replies. */
const brandInbox = process.env.CONTACT_FROM || "contact@elevate2point0.com";

type OutgoingMail = {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
};

type SendResult = { ok: boolean; status?: number; detail?: string };

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

/** RFC 2047 encoded-word so non-ASCII text survives in headers. */
function encodeWord(text: string): string {
  return `=?UTF-8?B?${Buffer.from(text, "utf8").toString("base64")}?=`;
}

/**
 * Build a valid From header. Non-ASCII display names (e.g. the em dash in
 * "2.0 — Elevate your vision") must be RFC 2047 encoded, otherwise the
 * sender name renders as mojibake in mail clients.
 */
function formatFrom(name: string, email: string): string {
  const isAscii = /^[\x20-\x7E]*$/.test(name);
  const display = isAscii ? `"${name.replace(/"/g, "")}"` : encodeWord(name);
  return `${display} <${email}>`;
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
    BREVO_API_KEY,
    BREVO_SENDER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_SENDER,
    CONTACT_TO,
  } = process.env;

  // Brevo (domain-authenticated, sends as contact@) is preferred; the Gmail
  // OAuth path stays as a fallback for environments that still have it wired.
  const useBrevo = Boolean(BREVO_API_KEY);
  const gmailReady = Boolean(
    GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN && GMAIL_SENDER,
  );

  if (!useBrevo && !gmailReady) {
    console.error(
      "[contact] No mail transport configured. Set BREVO_API_KEY, or the GMAIL_* vars. See .env.example.",
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

  const brandEmail = brandInbox;
  const to = CONTACT_TO || brandEmail;
  const senderEmail = useBrevo
    ? BREVO_SENDER || brandEmail
    : (GMAIL_SENDER as string);

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Phone", phone || "—"],
    ["Service", service || "—"],
  ];

  // --- Internal notification (to the 2.0 inbox) -------------------------
  const notifyBody = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([k, v]) => `
        <tr>
          <td style="padding:8px 0;color:#8a8a93;width:120px;vertical-align:top">${k}</td>
          <td style="padding:8px 0;color:#f5f5f6">${escapeHtml(v)}</td>
        </tr>`,
        )
        .join("")}
    </table>
    <div style="margin-top:18px;padding:16px 18px;background:#141417;border:1px solid rgba(255,255,255,0.06);border-radius:12px">
      <div style="color:#8a8a93;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Message</div>
      <div style="white-space:pre-wrap;line-height:1.6;color:#e7e7ea;font-size:14px">${escapeHtml(message)}</div>
    </div>`;
  const notifyHtml = emailShell({
    eyebrow: "New website inquiry",
    heading: `New inquiry from ${escapeHtml(name)}`,
    bodyHtml: notifyBody,
  });

  // --- Confirmation (to the person who reached out) ---------------------
  const confirmBody = `
    <p style="margin:0 0 16px;color:#a1a1aa;font-size:15px;line-height:1.7">
      Hi ${escapeHtml(name.split(" ")[0] || name)}, thanks for reaching out to 2.0 — we&rsquo;ve received your message and a member of our team will get back to you, usually within one business day.
    </p>
    <div style="margin-top:8px;padding:16px 18px;background:#141417;border:1px solid rgba(255,255,255,0.06);border-radius:12px">
      <div style="color:#8a8a93;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Your message</div>
      ${
        service
          ? `<div style="color:#c6ff34;font-size:13px;font-weight:600;margin-bottom:10px">Interested in: ${escapeHtml(service)}</div>`
          : ""
      }
      <div style="white-space:pre-wrap;line-height:1.6;color:#e7e7ea;font-size:14px">${escapeHtml(message)}</div>
    </div>
    <p style="margin:22px 0 0;color:#a1a1aa;font-size:14px;line-height:1.7">
      In the meantime, explore what we do at
      <a href="https://elevate2point0.com/services" style="color:#c6ff34;text-decoration:none;font-weight:600">our services</a>.
    </p>
    <p style="margin:16px 0 0;color:#71717a;font-size:13px">— The 2.0 team</p>`;
  const confirmHtml = emailShell({
    eyebrow: "We&rsquo;ve got your message",
    heading: "Thanks for reaching out 👋",
    bodyHtml: confirmBody,
  });

  const notify: OutgoingMail = {
    to,
    replyTo: email,
    subject: `New inquiry from ${name}${company ? ` · ${company}` : ""}`,
    html: notifyHtml,
  };
  const confirm: OutgoingMail = {
    to: email,
    replyTo: brandEmail,
    subject: "Thanks for reaching out to 2.0",
    html: confirmHtml,
  };

  try {
    const send = useBrevo
      ? (mail: OutgoingMail) =>
          sendViaBrevo(BREVO_API_KEY as string, senderEmail, mail)
      : await (async () => {
          const accessToken = await getAccessToken();
          return (mail: OutgoingMail) =>
            sendViaGmail(accessToken, senderEmail, mail);
        })();

    // The internal notification is the critical one — fail the request if it
    // doesn't send. The confirmation to the visitor is best-effort.
    const sent = await send(notify);
    if (!sent.ok) {
      console.error("[contact] Send failed:", sent.status, sent.detail);
      console.error("[contact] UNDELIVERED INQUIRY:", JSON.stringify({ name, email, company, phone, service, message }));
      return NextResponse.json(
        {
          ok: false,
          error: "We couldn't send your message right now. Please try again.",
        },
        { status: 502 },
      );
    }

    const confirmed = await send(confirm);
    if (!confirmed.ok) {
      console.error(
        "[contact] Confirmation email failed (non-fatal):",
        confirmed.status,
        confirmed.detail,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    console.error("[contact] UNDELIVERED INQUIRY:", JSON.stringify({ name, email, company, phone, service, message }));
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send your message right now. Please try again.",
      },
      { status: 500 },
    );
  }
}

/** Shared dark, on-brand email shell (lime / violet / near-black). */
function emailShell({
  eyebrow,
  heading,
  bodyHtml,
}: {
  eyebrow: string;
  heading: string;
  bodyHtml: string;
}): string {
  return `
  <div style="margin:0;padding:24px;background:#050506;font-family:'Helvetica Neue',Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;border-collapse:collapse">
      <tr><td style="height:4px;background:linear-gradient(90deg,#c6ff34,#7e3bed);border-radius:16px 16px 0 0;font-size:0;line-height:0">&nbsp;</td></tr>
      <tr><td style="background:#0f0f12;border:1px solid rgba(255,255,255,0.08);border-top:0;border-radius:0 0 16px 16px">
        <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06)">
          <div style="font-size:26px;font-weight:800;color:#f5f5f6;letter-spacing:-0.5px">2<span style="color:#c6ff34">.</span>0</div>
          <div style="margin-top:6px;font-size:11px;letter-spacing:3px;color:#71717a;text-transform:uppercase">${eyebrow}</div>
        </div>
        <div style="padding:28px 32px">
          <h1 style="margin:0 0 4px;font-size:22px;line-height:1.3;color:#f5f5f6;font-weight:700">${heading}</h1>
          <div style="margin-top:14px">${bodyHtml}</div>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);background:#0a0a0b;border-radius:0 0 16px 16px">
          <div style="font-size:12px;color:#71717a">
            <a href="https://elevate2point0.com" style="color:#c6ff34;text-decoration:none;font-weight:600">elevate2point0.com</a>
            &nbsp;·&nbsp; Elevate your vision
          </div>
        </div>
      </td></tr>
    </table>
  </div>`;
}

/** Build a base64url-encoded RFC 2822 message for the Gmail API. */
function buildMime({
  from,
  to,
  replyTo,
  subject,
  html,
}: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}): string {
  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${encodeWord(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html, "utf8").toString("base64"),
  ].join("\r\n");
  return base64url(mime);
}

async function sendViaGmail(
  accessToken: string,
  sender: string,
  mail: OutgoingMail,
): Promise<SendResult> {
  const raw = buildMime({
    from: formatFrom(BRAND_NAME, sender),
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
  });
  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    },
  );
  if (!res.ok) {
    return { ok: false, status: res.status, detail: await res.text() };
  }
  return { ok: true };
}

/**
 * Brevo's transactional HTTP API. Preferred over SMTP here: no socket to keep
 * open from a serverless function, and mail is DKIM-signed as the domain once
 * elevate2point0.com is authenticated in Brevo.
 */
async function sendViaBrevo(
  apiKey: string,
  sender: string,
  mail: OutgoingMail,
): Promise<SendResult> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: BRAND_NAME, email: sender },
      to: [{ email: mail.to }],
      replyTo: { email: mail.replyTo },
      subject: mail.subject,
      htmlContent: mail.html,
    }),
  });
  if (!res.ok) {
    return { ok: false, status: res.status, detail: await res.text() };
  }
  return { ok: true };
}
