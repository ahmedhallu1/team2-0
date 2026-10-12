# WhatsApp Business Platform — setup

2.0's Meta app: **2.0**, app id `2105200353595010`
(developers.facebook.com/apps/2105200353595010).

## What the code does

| Piece | Where | Purpose |
| --- | --- | --- |
| Webhook | `src/app/api/whatsapp/webhook/route.ts` | `GET` = Meta's subscription handshake. `POST` = inbound messages + delivery receipts, signature-verified. Each inbound message is emailed to `CONTACT_TO` (via Brevo), marked read, and optionally auto-replied. |
| Send API | `src/app/api/whatsapp/send/route.ts` | `POST` with `Authorization: Bearer $WHATSAPP_SEND_SECRET` and `{ "to": "+20…", "text": "…" }` or `{ "to": "+20…", "template": { "name": "…", "language": "en_US", "params": ["…"] } }`. |
| Helpers | `src/lib/whatsapp.ts` | Graph API client, signature + token verification, payload parsing. |
| Legal pages | `/privacy`, `/data-deletion` | Meta requires both URLs before an app can go live. |

Fail-closed: no `META_APP_SECRET` → webhook `POST` returns 503. No
`WHATSAPP_SEND_SECRET` → send endpoint returns 503.

## Environment variables (Vercel → website_2.0 → Settings → Environment Variables)

See `.env.example` for the full list and what each is for.
`META_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
`WHATSAPP_ACCESS_TOKEN` are the four needed to receive and reply.

## Connecting the webhook in Meta

1. Meta dashboard → **Use cases → Connect on WhatsApp → Customize → Configuration**.
2. **Callback URL:** `https://elevate2point0.com/api/whatsapp/webhook`
3. **Verify token:** the exact value of `WHATSAPP_VERIFY_TOKEN`.
4. **Verify and save**, then subscribe to the **messages** field.

## Going from test to production

The app currently has only Meta's **test number** (`+1 555 663 9161`), which can
message at most five pre-registered recipients, and the app is **unpublished** —
Meta delivers *no* production webhook data until it is published.

1. **App settings → Basic:** add the app icon (1024×1024), category, and set
   Privacy policy URL `https://elevate2point0.com/privacy` and User data
   deletion URL `https://elevate2point0.com/data-deletion`.
2. **Business verification** for the 2.0 business portfolio (Business settings →
   Security center). Required for production messaging limits and Tech Provider.
3. **Publish** the app.
4. **Add a real number** (API Setup → Add phone number) and a payment method.
5. **Permanent token:** Business settings → Users → System users → create one,
   assign the WhatsApp account, generate a token with
   `whatsapp_business_messaging` + `whatsapp_business_management`. The
   temporary token on the API Setup page expires in about 24 hours.

## Serving other businesses (Tech Provider)

Hosting WhatsApp for clients needs Meta's **Tech Provider** status: business
verification, then App Review for advanced access to
`whatsapp_business_management` and `whatsapp_business_messaging`, then
Embedded Signup (a Facebook Login for Business configuration) so each client
connects their own WhatsApp Business account. Once approved, the webhook above
already receives every connected account's traffic (`entry[].id` is the WABA).
Persisting per-client accounts needs a database, which this site doesn't have yet.

## Quick checks

```bash
# Handshake (what Meta does when you save the callback URL)
curl "https://elevate2point0.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=$WHATSAPP_VERIFY_TOKEN&hub.challenge=ping"   # → ping

# Outbound
curl -X POST https://elevate2point0.com/api/whatsapp/send \
  -H "Authorization: Bearer $WHATSAPP_SEND_SECRET" -H "Content-Type: application/json" \
  -d '{"to":"+201002200337","template":{"name":"hello_world","language":"en_US"}}'
```

Free-form `text` only delivers inside the 24-hour window after the customer's
last message; starting a conversation requires an approved template.
