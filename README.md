# 2.0 — Elevate Your Vision

The marketing site for **2.0**, a B2B growth team — services, portfolio,
process, about and a working contact form that sends inquiries over Gmail
(OAuth2). Built with Next.js 16 (App Router), React 19 and Tailwind CSS v4.

**Live:** https://elevate2point0.com

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** — the three-layer "Midnight Editorial" token system
  (black / lime `#C6FF34` / purple `#7E3BED`) lives in
  [`src/app/globals.css`](src/app/globals.css)
- **No animation library** — scroll reveals are an IntersectionObserver plus
  CSS transforms (`src/components/reveal.tsx`); everything respects
  `prefers-reduced-motion`
- **lucide-react** — icons
- **nodemailer** — contact form email via Gmail OAuth2

## Project structure

```
src/
  app/
    layout.tsx            # fonts (Inter + Bricolage Grotesque), metadata, chrome
    page.tsx              # home — hero, services, portfolio, process, CTA
    work/page.tsx         # portfolio — one case study per project
    services/page.tsx     # the six services in full
    process|about|contact # supporting pages
    globals.css           # design tokens + utilities
    api/contact/route.ts  # POST handler — sends mail via Gmail OAuth2
  components/             # sections + fx/ (tilt, magnetic, marquee, cursor)
  lib/services.ts         # the five services and what each one includes
  lib/work.ts             # the portfolio: what each project is, does and proves
  lib/design.ts           # the curated campaign/design pieces on /work
public/work/              # project screenshots + artwork used by /work
docs/EMAIL-SETUP.md       # free custom-domain email (ImprovMX + Brevo)
scripts/
  get-gmail-refresh-token.mjs  # one-time helper to mint a Gmail refresh token
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Configuring the contact form

The form posts to `/api/contact`, which sends through **Brevo** when
`BREVO_API_KEY` is set, and otherwise falls back to the Gmail OAuth transport
below. With neither configured it responds with a friendly "try again later"
message instead of crashing.

Brevo is the recommended path — see **[docs/EMAIL-SETUP.md](docs/EMAIL-SETUP.md)**,
which also covers receiving mail at `contact@elevate2point0.com` for free.

### Gmail OAuth (fallback)

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
