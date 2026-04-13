# Hostinger Email Configuration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing SMTP/IMAP email subsystem to the Hostinger mailbox `info@itlsolutions.net` so that outbound email sends and inbound email syncs — both locally and on Vercel — without code changes.

**Architecture:** Configuration-only change. The project already has `nodemailer` (SMTP) and `node-imap` (IMAP) wired through [src/lib/email.ts](../../../src/lib/email.ts) and [src/lib/imap.ts](../../../src/lib/imap.ts), plus admin UI at [/admin/email](../../../src/app/admin/email). This plan adds 12 environment variables to `.env` (local) and Vercel (production/preview/development), updates [.env.example](../../../.env.example) for documentation, and verifies the three flows (contact form, admin compose, IMAP sync).

**Tech Stack:** Next.js 15, Node.js, nodemailer (SMTP), node-imap (IMAP), Prisma, Vercel.

**Spec:** [docs/superpowers/specs/2026-04-13-hostinger-email-config-design.md](../specs/2026-04-13-hostinger-email-config-design.md)

**Prerequisites (human-only, cannot be automated):**
- Hostinger mailbox `info@itlsolutions.net` exists and the password is known.
- Access to the Vercel project dashboard (itsolutions project).
- Local dev server runs on `http://localhost:3003`.

---

## Task 1: Document new env vars in `.env.example`

**Rationale:** `.env.example` is the source of truth for "what env vars does this app need?". Anyone cloning the repo must be able to see the full list. Secrets are NOT committed — only keys and sample non-secret values.

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Read the current `.env.example` to see the style/section used**

Run: open [.env.example](../../../.env.example) and note that the existing "Email (Resend)" block is commented-out. We'll replace that entire block with a Hostinger block.

- [ ] **Step 2: Replace the Resend block with a Hostinger block**

Find this block in `.env.example`:

```bash
# Email (Resend) - Optional
# Get API key from https://resend.com
# RESEND_API_KEY="re_xxxxxxxxxxxxx"
# EMAIL_FROM="ITL Solutions <noreply@itlsolutions.net>"
# EMAIL_TO="admin@itlsolutions.net"
```

Replace it with:

```bash
# Email (Hostinger SMTP + IMAP)
# Mailbox: info@itlsolutions.net — hosted by Hostinger Business Email
# SMTP: smtp.hostinger.com:465 (SSL)
# IMAP: imap.hostinger.com:993 (SSL)
# Fill SMTP_PASS and IMAP_PASS with the mailbox password from Hostinger.
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="info@itlsolutions.net"
SMTP_PASS=""
SMTP_FROM="ITL Solutions <info@itlsolutions.net>"

IMAP_HOST="imap.hostinger.com"
IMAP_PORT="993"
IMAP_TLS="true"
IMAP_USER="info@itlsolutions.net"
IMAP_PASS=""

# Notification recipient for contact form + chat inquiries
EMAIL_TO="info@itlsolutions.net"
```

- [ ] **Step 3: Verify no secrets accidentally added**

Run: `grep -E "PASS=\"[^\"]+\"" .env.example`
Expected: no output (both password fields empty).

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "docs: document Hostinger SMTP/IMAP env vars in .env.example"
```

---

## Task 2: Add env vars to local `.env`

**Rationale:** Local dev needs real credentials so developers can test contact form, compose, and IMAP sync on `localhost:3003` before touching production.

**Files:**
- Modify: `.env`

**⚠️ Human step:** This task requires the Hostinger mailbox password. The executor (human or agent) must obtain it from the user / Hostinger dashboard before Step 2. **Never echo the password into chat or into command arguments that get logged.**

- [ ] **Step 1: Confirm `.env` is gitignored**

Run: `git check-ignore -v .env`
Expected: output shows `.gitignore:...:.env` (file is ignored).
If NOT ignored: STOP and fix `.gitignore` first — do not proceed until `.env` is gitignored.

- [ ] **Step 2: Append Hostinger block to `.env`**

Open [.env](../../../.env) in an editor (do NOT use shell heredoc with the real password — that puts it in shell history). Append at the bottom:

```bash
# Email (Hostinger SMTP + IMAP) — mailbox: info@itlsolutions.net
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="info@itlsolutions.net"
SMTP_PASS="<REAL_PASSWORD_FROM_HOSTINGER>"
SMTP_FROM="ITL Solutions <info@itlsolutions.net>"

IMAP_HOST="imap.hostinger.com"
IMAP_PORT="993"
IMAP_TLS="true"
IMAP_USER="info@itlsolutions.net"
IMAP_PASS="<REAL_PASSWORD_FROM_HOSTINGER>"

EMAIL_TO="info@itlsolutions.net"
```

Replace both `<REAL_PASSWORD_FROM_HOSTINGER>` placeholders with the actual mailbox password. They must match.

- [ ] **Step 3: Verify `.env` still ignored after edit**

Run: `git status`
Expected: `.env` does NOT appear in modified files. If it does, STOP and fix `.gitignore`.

- [ ] **Step 4: Restart dev server to load new env vars**

If dev server is running, stop it (Ctrl+C) and restart:

Run: `npm run dev`
Expected: server starts on `http://localhost:3003` with no env-related warnings.

- [ ] **Step 5: Sanity-check env vars loaded**

Add a one-off debug print in a terminal (NOT committed):

Run: `node -e "require('dotenv').config(); console.log('SMTP_HOST:', process.env.SMTP_HOST, 'SMTP_USER:', process.env.SMTP_USER, 'has SMTP_PASS:', !!process.env.SMTP_PASS)"`
Expected:
```
SMTP_HOST: smtp.hostinger.com SMTP_USER: info@itlsolutions.net has SMTP_PASS: true
```

- [ ] **Step 6: No commit**

Nothing to commit — `.env` is gitignored by design.

---

## Task 3: Verify outbound SMTP locally — contact form

**Rationale:** The contact form exercises `sendContactNotification()` AND `sendContactConfirmation()` — the two most-used outbound paths. If this works, the SMTP config is valid.

**Files:**
- Test: manually via browser at `http://localhost:3003/en/contact` (or `/ru/contact`).

- [ ] **Step 1: Ensure dev server is running**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/en/contact`
Expected: `200`.

- [ ] **Step 2: Submit the contact form**

Open `http://localhost:3003/en/contact` in a browser. Fill in:
- First name: `Test`
- Last name: `User`
- Email: a personal address you control (for confirmation receipt test) — call this `$YOUR_EMAIL`.
- Subject: `SMTP smoke test`
- Message: `Testing Hostinger SMTP from localhost — ignore.`

Click Submit.

Expected: success UI state (toast/banner — whatever the form renders for success).

- [ ] **Step 3: Check server logs for SMTP success**

Look at the `npm run dev` terminal output.
Expected: two log lines like:
```
Email sent: <some-message-id@smtp.hostinger.com>
Confirmation sent: <another-message-id@smtp.hostinger.com>
```
If you see `SMTP not configured, skipping email notification` → env vars not loaded. Go back to Task 2 Step 4.
If you see `Failed to send email: ...` → read the error. Common causes: wrong password, port blocked by local firewall (try `SMTP_PORT=587` + `SMTP_SECURE=false` as fallback).

- [ ] **Step 4: Verify notification received**

Log into `info@itlsolutions.net` via Hostinger webmail. Expected: one email with subject `New Contact: SMTP smoke test`, sender `info@itlsolutions.net`, HTML body containing "Test User" and the message text.

- [ ] **Step 5: Verify confirmation received**

Check `$YOUR_EMAIL` inbox. Expected: one email with subject `Thank you for contacting ITL Solutions`, sender `ITL Solutions <info@itlsolutions.net>`, greeting "Dear Test".

Also check spam folder — first email from a new domain may land in spam until recipient marks as Not Spam.

- [ ] **Step 6: Commit (no code changes, but note the verification)**

No files to commit. Move to next task.

---

## Task 4: Verify outbound SMTP locally — admin compose

**Rationale:** Admin compose uses `sendEmail()` which also writes to the `Email` table with `folder="Sent"`. Verifies both SMTP and the DB write path.

**Files:**
- Test: manually via browser at `http://localhost:3003/admin/email/compose`.

- [ ] **Step 1: Log in as admin**

Open `http://localhost:3003/admin` and authenticate with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

- [ ] **Step 2: Open compose**

Navigate to `http://localhost:3003/admin/email/compose`.
Expected: compose form renders with To / Subject / Body fields.

- [ ] **Step 3: Send test email**

- To: `$YOUR_EMAIL` (personal inbox you control).
- Subject: `Admin compose smoke test`
- Body: `Testing admin compose via Hostinger SMTP.`

Click Send.
Expected: success state in UI.

- [ ] **Step 4: Verify receipt**

Check `$YOUR_EMAIL`. Expected: email arrives within 30s from `info@itlsolutions.net`.

- [ ] **Step 5: Verify DB row created**

Run:
```bash
npx prisma studio
```

Open the `Email` table, filter by `folder = "Sent"`. Expected: a new row with `subject = "Admin compose smoke test"` and `to` array containing `$YOUR_EMAIL`.

(Alternative: run `npx prisma db seed --preview-feature` → skip, or use a raw psql query.)

Close Prisma Studio.

---

## Task 5: Verify inbound IMAP locally — sync

**Rationale:** Proves IMAP credentials and the sync endpoint function end-to-end.

**Files:**
- Test: manually via browser at `http://localhost:3003/admin/email` + external email client.

- [ ] **Step 1: Send a test email TO `info@itlsolutions.net` from an external account**

From `$YOUR_EMAIL` (gmail / outlook / whatever — NOT from the Hostinger mailbox itself), send:
- To: `info@itlsolutions.net`
- Subject: `IMAP sync smoke test`
- Body: `Testing inbound IMAP.`

Wait ~15 seconds for delivery.

- [ ] **Step 2: Confirm delivery at Hostinger webmail**

Log into Hostinger webmail for `info@itlsolutions.net`. Expected: the test email is in Inbox.

- [ ] **Step 3: Open admin email UI and press Sync**

Navigate to `http://localhost:3003/admin/email`. Press the Sync button.
Expected: no error toast; list refreshes.

If you see a 500 error: check `npm run dev` logs for the IMAP error. Common causes: wrong password (same as SMTP? check both), `IMAP_TLS` mismatch, IMAP access disabled in Hostinger (enable in Hostinger webmail → Settings → IMAP/POP Access).

- [ ] **Step 4: Verify the email appears in the admin inbox**

Expected: a row in the inbox with subject `IMAP sync smoke test` and sender `$YOUR_EMAIL`.

- [ ] **Step 5: Open the email and verify body**

Click the row. Expected: email detail view renders the body text.

---

## Task 6: Add env vars to Vercel (all three environments)

**Rationale:** Production, Preview, and Development on Vercel each have independent env var scopes. All three need the same values so every deployed branch has working email.

**Files:** None (Vercel Dashboard).

**⚠️ Human step:** Requires Vercel dashboard access.

- [ ] **Step 1: Open Vercel project settings**

Navigate to: https://vercel.com/&lt;team&gt;/itsolutions/settings/environment-variables

- [ ] **Step 2: Add each of the 12 variables**

For each variable in the table below:
1. Click "Add New".
2. Enter Key and Value exactly.
3. Check all three environment boxes: Production, Preview, Development.
4. Click Save.

| Key | Value |
|---|---|
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `info@itlsolutions.net` |
| `SMTP_PASS` | *(Hostinger mailbox password)* |
| `SMTP_FROM` | `ITL Solutions <info@itlsolutions.net>` |
| `IMAP_HOST` | `imap.hostinger.com` |
| `IMAP_PORT` | `993` |
| `IMAP_TLS` | `true` |
| `IMAP_USER` | `info@itlsolutions.net` |
| `IMAP_PASS` | *(same password as SMTP_PASS)* |
| `EMAIL_TO` | `info@itlsolutions.net` |

- [ ] **Step 3: Mark `SMTP_PASS` and `IMAP_PASS` as Sensitive**

In the Vercel UI, click the "Sensitive" checkbox (or gear icon → Sensitive) on both password variables. This prevents them from being shown in subsequent dashboard visits.

- [ ] **Step 4: Verify the list**

Expected: 12 new variables visible in the table, each scoped to Production + Preview + Development. Password values show as `••••••••`.

- [ ] **Step 5: Trigger redeploy**

Vercel does not hot-reload env vars. From the Vercel dashboard → Deployments tab → click the "..." menu on the latest Production deployment → "Redeploy" → uncheck "Use existing build cache" → Redeploy.

Expected: new deployment starts, completes in 2-5 min, status goes Ready.

---

## Task 7: Verify production — contact form

**Rationale:** Same as Task 3 but against production URL to confirm Vercel env vars are active.

**Files:** None (manual verification).

- [ ] **Step 1: Identify production URL**

Run: `vercel inspect --prod 2>&1 | grep -i "url"` (if `vercel` CLI installed)
Or look at Vercel dashboard → Deployments → Production → URL.

Call this `$PROD_URL` (e.g., `https://itlsolutions.net`).

- [ ] **Step 2: Submit contact form on production**

Open `$PROD_URL/en/contact`. Fill with test data as in Task 3 Step 2 (message: `Production SMTP smoke test — ignore.`). Submit.
Expected: success state.

- [ ] **Step 3: Check Vercel logs**

Vercel dashboard → Deployments → Production → Logs (or Runtime Logs).
Expected: log lines `Email sent: ...` and `Confirmation sent: ...`.

If you see `SMTP not configured`: env vars weren't applied. Redeploy again.

- [ ] **Step 4: Verify notification at Hostinger webmail**

Log into `info@itlsolutions.net`. Expected: email with subject `New Contact: Production SMTP smoke test`.

- [ ] **Step 5: Verify confirmation at `$YOUR_EMAIL`**

Expected: confirmation email from `ITL Solutions <info@itlsolutions.net>`.

---

## Task 8: Verify production — admin compose

**Files:** None (manual verification).

- [ ] **Step 1: Log into production admin**

Navigate to `$PROD_URL/admin`. Log in with production `ADMIN_EMAIL` / `ADMIN_PASSWORD` (these may differ from local — check Vercel env vars).

- [ ] **Step 2: Send test email from compose**

Navigate to `$PROD_URL/admin/email/compose`. Send:
- To: `$YOUR_EMAIL`
- Subject: `Prod compose smoke test`
- Body: `Testing production admin compose.`

Expected: success state in UI.

- [ ] **Step 3: Verify receipt**

Check `$YOUR_EMAIL`. Expected: email arrives.

- [ ] **Step 4: Verify DB row (production)**

Skip if not straightforward — production DB is Neon, may require temporary connection. Optional verification. The success state in UI is sufficient if the email arrives.

---

## Task 9: Verify production — IMAP sync

**Files:** None (manual verification).

- [ ] **Step 1: Send test email to `info@itlsolutions.net` from `$YOUR_EMAIL`**

Subject: `Prod IMAP sync smoke test`. Body: `Testing production IMAP.`

Wait ~15 seconds for delivery to Hostinger.

- [ ] **Step 2: Press Sync in production admin**

Navigate to `$PROD_URL/admin/email`. Press Sync.
Expected: no error; row for `Prod IMAP sync smoke test` appears.

- [ ] **Step 3: Open the email and verify body**

Expected: detail view renders body text correctly.

---

## Task 10: Negative-path verification (optional but recommended)

**Rationale:** Confirm the app degrades gracefully if credentials become invalid — catches misconfigurations early.

**Files:** None (manual).

- [ ] **Step 1: Temporarily break local `SMTP_PASS`**

Edit local `.env` — change `SMTP_PASS` to `"wrong-password"`. Restart dev server (`npm run dev`).

- [ ] **Step 2: Submit contact form again**

Open `http://localhost:3003/en/contact`, submit any test message.
Expected: form still shows success (the inquiry is still written to DB — email is best-effort). Server logs show `Failed to send email: Invalid login: ...` — this is the desired graceful degradation.

- [ ] **Step 3: Press Sync in admin**

Navigate to `http://localhost:3003/admin/email`, press Sync.
Expected: visible error state in UI (toast or banner). IMAP uses same password, so this should fail.

- [ ] **Step 4: Restore correct password in `.env`**

Revert `SMTP_PASS` and `IMAP_PASS` to the real Hostinger password. Restart dev server.

- [ ] **Step 5: Confirm restored functionality**

Press Sync again in admin.
Expected: no error.

---

## Task 11: Final documentation commit

**Files:**
- Modify: `README.md` (optional — only if it mentions email setup; otherwise skip).

- [ ] **Step 1: Check if README mentions email**

Run: `grep -in "email\|smtp\|imap" README.md`
Expected: either no matches (skip this task) or existing references to Resend (needs updating).

- [ ] **Step 2: If Resend is mentioned, replace with Hostinger reference**

Find any "Configure Resend" / "RESEND_API_KEY" references. Replace with a short line:

```markdown
### Email

The app uses Hostinger SMTP + IMAP for transactional and admin email via `info@itlsolutions.net`. See `.env.example` for required variables (`SMTP_*`, `IMAP_*`, `EMAIL_TO`).
```

- [ ] **Step 3: Commit (if README was modified)**

```bash
git add README.md
git commit -m "docs: update README email section to reference Hostinger"
```

- [ ] **Step 4: Push all commits**

```bash
git push
```

Expected: Vercel auto-deploys the push (no env var changes this time, so nothing extra to re-verify).

---

## Success Criteria (copy from spec)

At the end of all tasks, all five must be true:

1. ✅ Contact form submission produces a notification email in the Hostinger mailbox within 30 seconds.
2. ✅ Contact form confirmation email is delivered to the visitor's address.
3. ✅ `/admin/email` Sync button fetches new messages from Hostinger IMAP without error.
4. ✅ `/admin/email/compose` sends outbound mail successfully and records it in the DB.
5. ✅ All of the above work identically on `localhost:3003` and on the Vercel production deployment.

## Rollback

If anything goes wrong after Task 6:
- Local: comment out the Hostinger block in `.env`, restart dev server. App degrades to "SMTP not configured" gracefully.
- Vercel: delete all 12 env vars from the Vercel dashboard → redeploy. App degrades same way.

## Notes for the Executor

- **This plan has no code changes.** Tasks 1 and 11 edit docs; all other tasks are configuration and manual verification.
- **Secrets hygiene:** never paste `SMTP_PASS` / `IMAP_PASS` into chat, shell history, or committed files. Only into `.env` (gitignored) and Vercel dashboard (encrypted).
- **Hostinger IMAP/POP access** must be enabled for the mailbox. If Task 5 fails with connection refused, log into Hostinger webmail → Settings → enable IMAP.
- **Deliverability to Gmail/Outlook:** first few emails may land in spam. Ensure SPF/DKIM records exist in Hostinger DNS (usually auto-configured). Out of scope for this plan.
