# 2.0 — Elevate Your Vision

A one-page showcase site for **2.0**, a B2B services team. Built with
Next.js 16 (App Router), React 19, Tailwind CSS v4 and framer-motion, with a
working contact form that sends inquiries over Gmail (OAuth2).

**Live:** https://website20-green.vercel.app

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** — palette tokens (navy / royal blue / gold) live in
  [`src/app/globals.css`](src/app/globals.css)
- **framer-motion** — scroll reveals (`src/components/reveal.tsx`)
- **lucide-react** — icons
- **nodemailer** — contact form email via Gmail OAuth2

## Project structure

```
src/
  app/
    layout.tsx            # fonts (Inter + Playfair), metadata
    page.tsx              # composes the sections
    globals.css           # design tokens + utilities
    api/contact/route.ts  # POST handler — sends mail via Gmail OAuth2
  components/              # hero, services, process, about, contact, header, footer
  lib/services.ts         # all 17 services, grouped into 4 pillars
scripts/
  get-gmail-refresh-token.mjs  # one-time helper to mint a Gmail refresh token
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Configuring the contact form (Gmail)

The form posts to `/api/contact`, which emails inquiries to you via the Gmail
account you authorize. Until the env vars below are set, the form responds with
a friendly "try again later" message instead of crashing.

### 1. Google Cloud Console (one-time)

For the project that owns your **Web** OAuth client:

1. **APIs & Services → Library →** enable **Gmail API**.
2. **OAuth consent screen →** add the scope
   `https://www.googleapis.com/auth/gmail.send`, and add the Gmail account you
   will send from as a **Test user** (if the app is in "Testing").
3. **Credentials →** open your Web client → under **Authorized redirect URIs**
   add exactly: `http://localhost:5555/oauth2callback`

### 2. Fill credentials

Copy `.env.example` to `.env.local` and set `GMAIL_CLIENT_ID` and
`GMAIL_CLIENT_SECRET` (already filled locally).

### 3. Mint a refresh token

```bash
node scripts/get-gmail-refresh-token.mjs
```

A browser opens; consent with the Gmail account you want to send from. The
script prints `GMAIL_REFRESH_TOKEN=…`. Paste it into `.env.local`, then set:

```
GMAIL_SENDER=the-address-you-authorized@gmail.com
CONTACT_TO=where-inquiries-should-arrive@gmail.com   # optional, defaults to GMAIL_SENDER
```

## Deployment (Vercel)

Already linked to `ahmedhallu1s-projects/website_2.0`.

```bash
vercel deploy --prod     # deploy to production
```

Add the same env vars to Vercel (Project → Settings → Environment Variables, or
CLI) and redeploy so the contact form works in production:

```bash
vercel env add GMAIL_CLIENT_ID production
vercel env add GMAIL_CLIENT_SECRET production
vercel env add GMAIL_REFRESH_TOKEN production
vercel env add GMAIL_SENDER production
vercel env add CONTACT_TO production                  # optional
vercel env add NEXT_PUBLIC_CONTACT_EMAIL production   # optional, shows a mailto link
vercel env add NEXT_PUBLIC_SITE_URL production        # e.g. https://website20-green.vercel.app
```

> **Security:** `.env.local` is gitignored — never commit real secrets. If an
> OAuth client secret is ever exposed, rotate it in Google Cloud Console.
