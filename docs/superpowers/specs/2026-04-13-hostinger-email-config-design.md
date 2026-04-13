# Hostinger Email Configuration — Design

**Date:** 2026-04-13
**Author:** Latif Rj
**Status:** Approved (design phase)

## Goal

Wire the project's existing email subsystem to the Hostinger-hosted mailbox `info@itlsolutions.net` so that:

1. Outbound email (contact-form notifications, confirmation emails, chat-inquiry notifications, admin compose) is sent via Hostinger SMTP from `info@itlsolutions.net`.
2. Inbound email addressed to `info@itlsolutions.net` is synced via IMAP into the admin inbox at `/admin/email`.
3. The same configuration is active in local development (`.env`) and in production (Vercel).

## Non-Goals

- No code changes to [src/lib/email.ts](../../../src/lib/email.ts), [src/lib/imap.ts](../../../src/lib/imap.ts), or any admin email UI.
- No refactor of hardcoded `"info@itlsolutions.net"` defaults in the code.
- No change to `ADMIN_EMAIL` (the admin-login credential, unrelated to the mailbox).
- No migration of existing emails from another provider.

## Context — What Already Exists

The email subsystem is fully implemented; only configuration is missing.

| Concern | Implementation |
|---|---|
| SMTP transport | [src/lib/email.ts](../../../src/lib/email.ts) — `getTransporter()` reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`. |
| Contact form | [src/app/[locale]/contact/page.tsx](../../../src/app/[locale]/contact/page.tsx) → `sendContactNotification()` + `sendContactConfirmation()`. |
| Chat inquiry | [src/app/api/chat-inquiry/route.ts](../../../src/app/api/chat-inquiry/route.ts) → `sendChatInquiryNotification()`. |
| Admin compose | [src/app/admin/email/compose/ComposeEmail.tsx](../../../src/app/admin/email/compose/ComposeEmail.tsx) → `sendEmail()`. |
| IMAP receive | [src/lib/imap.ts](../../../src/lib/imap.ts) — reads `IMAP_HOST`, `IMAP_PORT`, `IMAP_TLS`, `IMAP_USER`, `IMAP_PASS`. |
| Sync endpoint | [src/app/api/admin/email/sync/route.ts](../../../src/app/api/admin/email/sync/route.ts). |
| Storage | Prisma `Email` model. |

Without SMTP env vars, `getTransporter()` returns `null` and outbound silently no-ops.
Without IMAP env vars, `getImapConnection()` throws — sync button in admin fails.

## Approach — B: Minimum + Explicit Variables

Add environment variables in two places (local + Vercel). No code changes.

### 1. Environment Variables

All variables below are required unless marked optional.

| Key | Value | Purpose |
|---|---|---|
| `SMTP_HOST` | `smtp.hostinger.com` | Hostinger SMTP server |
| `SMTP_PORT` | `465` | SSL port |
| `SMTP_SECURE` | `true` | Use implicit TLS (matches port 465) |
| `SMTP_USER` | `info@itlsolutions.net` | Full mailbox address (Hostinger auth) |
| `SMTP_PASS` | *(mailbox password)* | **Secret.** Not committed. |
| `SMTP_FROM` | `ITL Solutions <info@itlsolutions.net>` | Explicit From header (overrides `SMTP_USER` default) |
| `IMAP_HOST` | `imap.hostinger.com` | Hostinger IMAP server |
| `IMAP_PORT` | `993` | SSL port |
| `IMAP_TLS` | `true` | TLS enabled |
| `IMAP_USER` | `info@itlsolutions.net` | Same mailbox |
| `IMAP_PASS` | *(mailbox password)* | **Secret.** Same as `SMTP_PASS`. |
| `EMAIL_TO` | `info@itlsolutions.net` | Explicit notification recipient (overrides code default) |

### 2. Local Development

Append the block above to [.env](../../../.env). Secrets filled in by the user; file is already gitignored.

### 3. Production (Vercel)

Add the same 12 variables via **Vercel Dashboard → Project Settings → Environment Variables**, applied to all three environments: `Production`, `Preview`, `Development`.

After saving, trigger a redeploy (Vercel does not hot-reload env vars).

### 4. Documentation — [.env.example](../../../.env.example)

Add a documented block listing all 12 keys with placeholder values or empty strings and a `# Hostinger Email` comment header. No secrets. This lets future contributors self-configure.

## Data Flow (after configuration)

```
Visitor → Contact form POST → src/app/[locale]/contact/page.tsx
                              ↓
                         sendContactNotification()  ──→ Hostinger SMTP ──→ info@itlsolutions.net
                         sendContactConfirmation()  ──→ Hostinger SMTP ──→ visitor's email
                              ↓
                         (prisma.inquiry.create)

Admin → /admin/email → "Sync" button
                         ↓
                    /api/admin/email/sync → getImapConnection() → Hostinger IMAP
                         ↓
                    Fetch new messages → prisma.email.create()
                         ↓
                    UI re-fetches inbox from DB

Admin → /admin/email/compose → sendEmail() → Hostinger SMTP
                                   ↓
                              prisma.email.create(folder="Sent")
```

## Error Handling

Existing code already handles the relevant failure modes:

- **SMTP misconfigured / wrong password:** `nodemailer.sendMail` throws; caller logs and returns `null` (contact/chat notifications are best-effort). Admin compose surfaces the error to the UI.
- **IMAP connection failure:** `getImapConnection()` throws; sync endpoint returns 5xx; admin UI shows error toast.
- **Hostinger rate limits** (300 emails/hr on standard plan): not a concern for current volume; if hit, nodemailer error bubbles up.

No new error handling required.

## Testing Plan

### Local (before Vercel)

1. Start `npm run dev` on `http://localhost:3003`.
2. **Outbound — contact form:** submit form on `/contact` → verify admin notification arrives at `info@itlsolutions.net` and confirmation arrives at test visitor address.
3. **Outbound — compose:** log in as admin, send test email to a personal address from `/admin/email/compose` → verify delivery and that message appears in DB as `folder="Sent"`.
4. **Inbound — IMAP sync:** send a test email *to* `info@itlsolutions.net` from an external account, press Sync in `/admin/email` → verify the message appears in the inbox list.
5. **Failure mode:** temporarily break `SMTP_PASS` → verify contact form still returns success (best-effort) and admin compose surfaces a clear error.

### Production (after Vercel env vars + redeploy)

Repeat steps 2–4 against the production URL.

## Rollback

All changes are configuration. Rollback = remove the env vars (locally: comment out in `.env`; Vercel: delete variables and redeploy). Code paths gracefully no-op when env vars are absent.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Password leaks via commit | `.env` is gitignored; secrets never in `.env.example`. |
| Wrong Hostinger port (565 vs 587) blocks sending | Use documented `465` + `SMTP_SECURE=true` (SSL). If `465` is blocked by network, fallback is `587` + `SMTP_SECURE=false` (STARTTLS). |
| From-address rejected as spoof by recipients | `SMTP_FROM` domain matches `SMTP_USER` domain — no DMARC conflict. SPF/DKIM configured by Hostinger for the domain. |
| Hostinger IP flagged as spam by Gmail | Monitor deliverability; if issues, enable DKIM in Hostinger DNS (typically one-click). Out of scope for this change. |
| Vercel env vars not reloaded | Redeploy after saving in Vercel Dashboard. |

## Success Criteria

1. Contact form submission produces a notification email in the Hostinger mailbox within 30 seconds.
2. Contact form confirmation email is delivered to the visitor's address.
3. `/admin/email` Sync button fetches new messages from Hostinger IMAP without error.
4. `/admin/email/compose` sends outbound mail successfully and records it in the DB.
5. All of the above work identically on `localhost:3003` and on the Vercel production deployment.
