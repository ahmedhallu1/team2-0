# Email on elevate2point0.com

Goal: receive mail at `contact@`, `info@`, `sales@` … in the normal Gmail
inbox, reply **from** those addresses, and let the website's contact form send
as the domain — on free tiers, with DNS staying at Squarespace.

Background: Google Workspace for this domain was cancelled on **12 Aug 2026**,
which killed `info@` and the contact form's Gmail OAuth token with it.

| | Service | Free tier | Status |
|---|---|---|---|
| **Receiving** | [ImprovMX](https://improvmx.com) | 1 domain, 25 aliases, 500 forwards/day | ✅ done |
| **Replying from Gmail** | Gmail "Send mail as" over Brevo SMTP | — | ✅ done |
| **Website form sending** | [Brevo](https://brevo.com) API | 300 emails/day | ⛔ needs a sender + API key |

---

## ✅ 1. Receiving — ImprovMX

Live since 21 Aug. DNS at Squarespace now reads:

| Host | Type | Priority | Data |
|---|---|---|---|
| `@` | MX | 10 | `mx1.improvmx.com` |
| `@` | MX | 20 | `mx2.improvmx.com` |
| `@` | TXT | — | `v=spf1 include:spf.improvmx.com include:spf.brevo.com ~all` |

The old `MX 1 smtp.google.com` is gone. One SPF record only — both `include:`
values live on that single line; two separate SPF records is a hard failure.

## ✅ 2. Replying from Gmail

Gmail → Settings → Accounts and Import → **Send mail as**, relaying through
`smtp-relay.brevo.com:587` with the Brevo SMTP login and an SMTP key.

## ⛔ 3. The contact form

`src/app/api/contact/route.ts` picks its transport at runtime: **Brevo when
`BREVO_API_KEY` is set**, otherwise the legacy Gmail OAuth path. That Gmail
path now fails with `access_not_configured Account Restricted` — the OAuth
token belonged to the deleted Workspace user — so the form is down until Brevo
is wired up.

Two things are needed, both only doable from the Brevo dashboard:

**a. Register the sender.** Brevo → **Senders, Domains & Dedicated IPs →
Senders → Add a sender** → `contact@elevate2point0.com`. Brevo emails a
confirmation; ImprovMX forwards it to the Gmail inbox; click it. Brevo rejects
sends from unregistered addresses, so this cannot be skipped.

**b. Create an API key.** Brevo → **SMTP & API → API Keys → Generate a new API
key**. Add it on Vercel as `BREVO_API_KEY` (Project → Settings → Environment
Variables → Production), then redeploy.

Everything else is already set on Vercel:

| Variable | Value |
|---|---|
| `BREVO_SENDER` | `contact@elevate2point0.com` |
| `CONTACT_TO` | `contact@elevate2point0.com` |
| `CONTACT_FROM` | `contact@elevate2point0.com` |

Once the form works, the stale `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` /
`GMAIL_REFRESH_TOKEN` / `GMAIL_SENDER` variables can be deleted — they point
at the deleted Workspace user and will only ever fail.

## Recommended follow-up — authenticate the domain in Brevo

Sender verification (3a) is enough to send, but mail is signed with Brevo's
domain rather than yours, which costs some deliverability. To fix that: Brevo →
**Domains → Add a domain** → `elevate2point0.com`, then add the two TXT records
it shows (a `brevo-code` verification string and a `brevo._domainkey` DKIM key)
at Squarespace and hit **Authenticate**. Worth adding a DMARC record at the
same time:

| Host | Type | Data |
|---|---|---|
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:contact@elevate2point0.com` |

## Verify

- Mail **to** `contact@elevate2point0.com` arrives in Gmail. ✅
- A reply **from** `contact@elevate2point0.com` reaches the other end showing
  the domain, and passes SPF + DKIM (Gmail → *Show original*).
- A real submission at <https://elevate2point0.com/contact> produces both the
  internal notification and the visitor confirmation.

Until then, failed submissions are written to the Vercel runtime logs under
`[contact] UNDELIVERED INQUIRY:` — so nothing is silently lost.

## Limits worth knowing

- Brevo free: **300 emails/day**.
- ImprovMX free: **25 aliases, 500 forwards/day**, 7 days of logs.
- Neither stores mail. Forwarding is delivery-only.
