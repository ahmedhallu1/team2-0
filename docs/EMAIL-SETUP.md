# Free email on elevate2point0.com

Goal: receive mail at `contact@`, `info@`, `sales@` … in the normal Gmail
inbox, and **reply from those addresses** — on free tiers only, with DNS
staying where it is (Squarespace).

> **Why this is needed now.** The domain's `MX` still points at
> `smtp.google.com`, but the **Google Workspace Business Starter subscription
> for elevate2point0.com was cancelled on 12 Aug 2026**. Nothing is delivered
> to `info@elevate2point0.com` today, and the contact form's Gmail OAuth token
> (minted for that Workspace user) is dead with it. Until step 1 is done, mail
> to the domain bounces.

| | Service | Free tier |
|---|---|---|
| **Receiving** | [ImprovMX](https://improvmx.com) | 1 domain, 25 aliases, 500 forwards/day |
| **Sending** | [Brevo](https://brevo.com) | 300 emails/day, DKIM-signed as the domain |

Brevo is already in use for ELECT-I, so the account exists — this only adds a
second domain to it.

*Alternative:* Cloudflare Email Routing is free with unlimited aliases and no
daily cap, but it requires moving the domain's nameservers off Squarespace.
ImprovMX is chosen here because it needs nothing but a few DNS records, so the
live site can't be affected.

---

## 1. Receiving — ImprovMX

1. Sign up at improvmx.com and add the domain `elevate2point0.com`.
2. Add the aliases, all forwarding to the personal Gmail:
   `contact@`, `info@`, `sales@` (+ a `*` catch-all if you want everything).
3. In **Squarespace → Domains → elevate2point0.com → DNS Settings**:

   **Delete** the existing record:

   | Host | Type | Priority | Data |
   |---|---|---|---|
   | `@` | MX | 1 | `smtp.google.com` |

   **Add:**

   | Host | Type | Priority | Data |
   |---|---|---|---|
   | `@` | MX | 10 | `mx1.improvmx.com` |
   | `@` | MX | 20 | `mx2.improvmx.com` |
   | `@` | TXT | — | `v=spf1 include:spf.improvmx.com include:spf.brevo.com ~all` |

   One SPF record only — the `include:` for both services goes in that single
   line. Two separate SPF records is a hard failure, not a merge.

4. Wait for ImprovMX to show the domain as **Active**, then email
   `contact@elevate2point0.com` from another account and confirm it lands.

## 2. Sending — Brevo

1. Brevo → **Senders, Domains & Dedicated IPs → Domains → Add a domain** →
   `elevate2point0.com`.
2. Brevo shows two records; add both at Squarespace (values are
   account-specific, copy them from Brevo):

   | Host | Type | Data |
   |---|---|---|
   | `brevo-code` | TXT | the verification string Brevo shows |
   | `brevo._domainkey` | TXT | the DKIM key Brevo shows |

3. Recommended, so replies aren't treated as spoofing:

   | Host | Type | Data |
   |---|---|---|
   | `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:contact@elevate2point0.com` |

4. Hit **Authenticate** in Brevo until every row is green.

## 3. Replying from Gmail

Gmail → **Settings → Accounts and Import → Send mail as → Add another email
address**:

- Name: `2.0` · Email: `contact@elevate2point0.com`
- **Uncheck** "Treat as an alias"
- SMTP Server: `smtp-relay.brevo.com` · Port: `587` · TLS
- Username: the Brevo SMTP login (Brevo → **SMTP & API → SMTP**, looks like
  `…@smtp-brevo.com`) · Password: an **SMTP key** generated on the same page

Gmail emails a confirmation code to the address — ImprovMX forwards it to the
inbox. Paste it in. Repeat for `info@` and `sales@`, and set `contact@` as the
default "send from" if you want replies to default to it.

## 4. Point the contact form at the new setup

`src/app/api/contact/route.ts` sends through **Brevo when `BREVO_API_KEY` is
set**, and falls back to the old Gmail OAuth path otherwise. Once step 2 is
green, set these on Vercel (Production) and redeploy:

```bash
vercel env add BREVO_API_KEY production      # Brevo → SMTP & API → API Keys
vercel env add BREVO_SENDER production       # contact@elevate2point0.com
vercel env add CONTACT_TO production         # contact@elevate2point0.com
vercel env add CONTACT_FROM production       # contact@elevate2point0.com
```

The stale `GMAIL_*` variables can then be removed — they point at the deleted
Workspace user and will only ever fail.

## 5. Verify

- Mail sent **to** `contact@elevate2point0.com` arrives in Gmail.
- A reply **from** `contact@elevate2point0.com` arrives at the other end
  showing the domain, and passes SPF + DKIM (Gmail → *Show original*).
- A real submission through <https://elevate2point0.com/contact> produces both
  the internal notification and the visitor confirmation.

Then flip the address shown on the site from `info@` to `contact@`
(`contactEmail` in `src/lib/contact.ts`).

## Limits worth knowing

- Brevo free: **300 emails/day** — replies and form mail sit far under it.
- ImprovMX free: **25 aliases, 500 forwards/day**, 7 days of logs.
- Neither stores mail. Forwarding is delivery-only: if Gmail is deleted, the
  history goes with it.
