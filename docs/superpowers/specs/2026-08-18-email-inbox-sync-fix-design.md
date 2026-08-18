# Admin Email Inbox Not Syncing — Design

**Date:** 2026-08-18
**Author:** Latif Rj
**Status:** Approved (design phase)

## Problem

`/admin/email` shows "Last sync: 1/24/2026, 11:34:51 AM" and no new incoming mail. Investigation (browser screenshot + Vercel deployments tab, checked live by the user) found four separate, stackable issues:

1. **Stalled deployment pipeline.** The Vercel project's latest *successful* deployment is old — new pushes to `main` are not producing new deployments. Production is serving a build that predates the current `EmailClient.tsx` (the live UI is missing the "Sync" button that exists in the committed code at [src/app/admin/email/EmailClient.tsx](../../../src/app/admin/email/EmailClient.tsx#L167-L174), confirmed via screenshot).
2. **Unsafe build script.** [package.json](../../../package.json) `build` script runs `prisma generate && prisma db push && prisma db seed && next build` — every single deployment applies a schema push and re-runs the seed script. If the database (Neon, which suspends on idle) is briefly unreachable during the Vercel build step, the entire build fails. Running `db seed` on every production build is also unsafe in itself, independent of the outage risk.
3. **Silent sync failures.** [src/app/admin/email/EmailClient.tsx](../../../src/app/admin/email/EmailClient.tsx#L64-L76) `handleSync()` only acts on `res.ok`; a failed sync (bad IMAP credentials, timeout, etc.) just stops the spinner with no visible error, so a broken mailbox connection looks identical to "nothing new."
4. **No automatic sync.** [src/lib/imap.ts](../../../src/lib/imap.ts) `syncFolder()` is only ever invoked from the manual "Sync" button via [src/app/api/admin/email/sync/route.ts](../../../src/app/api/admin/email/sync/route.ts). There is no cron, webhook, or background job. Even with a healthy deployment, inbound mail only appears when someone opens the admin panel and clicks Sync.

Root cause of the *current* symptom is #1 (production is stuck on a stale build). #2–#4 are real, independently confirmed problems that need fixing so the same failure mode doesn't recur and so "showing incoming mail" actually works unattended going forward.

## Non-Goals

- No rewrite of the IMAP sync logic itself (`syncFolder`'s UID-tracking approach is sound).
- No change to the outbound SMTP path ([src/lib/email.ts](../../../src/lib/email.ts)) — this spec is inbound-only.
- No migration off Vercel/Neon.
- No move to IMAP IDLE / push-based sync — polling on a schedule is sufficient at this mailbox's volume.

## Fix Plan

### 1. Restore the deployment pipeline (manual, no code)

Not a code change — the user will check Vercel → Project → Settings → Git: confirm the repo is still connected, `main` is the Production Branch, and the GitHub App still has access, then trigger a fresh deployment. This is a prerequisite for everything below to actually reach production.

### 2. Remove migrations/seed from the build step

Change [package.json](../../../package.json):

```diff
- "build": "prisma generate && prisma db push && prisma db seed && next build",
+ "build": "prisma generate && next build",
```

`db:push` and `db:seed` scripts already exist and remain available to run manually/deliberately. This removes the build-time dependency on live DB reachability and stops re-seeding production on every deploy.

### 3. Surface sync errors in the UI

In [src/app/admin/email/EmailClient.tsx](../../../src/app/admin/email/EmailClient.tsx) `handleSync()`: on a non-OK response, read the JSON error body and show it (inline banner near the Sync button, using existing styling patterns already in this component — no new UI library). Success path (`router.refresh()`) is unchanged.

### 4. Automatic scheduled sync via GitHub Actions

Vercel plan is Hobby, where Vercel Cron is capped at one run/day — not frequent enough. Use a GitHub Actions scheduled workflow instead:

- New route `src/app/api/cron/email-sync/route.ts`: requires a bearer/header secret (`CRON_SECRET`), calls `syncFolder("INBOX")`, returns the synced count. Unauthenticated requests get 401.
- New workflow `.github/workflows/email-sync.yml`: runs on a cron schedule (every 5 minutes), does a single authenticated `curl` POST to the production URL's cron endpoint.
- `CRON_SECRET` added to both GitHub Actions repo secrets and Vercel project env vars (same value).
- Add `export const maxDuration = 60;` to both the existing manual sync route and the new cron route, so a large backlog doesn't get silently killed mid-batch by the platform's default function timeout.

## Testing

- `npm run build` succeeds locally without touching the database.
- Manual sync button (once deployed) surfaces a visible error when `IMAP_PASS` is temporarily set wrong, and succeeds normally when correct.
- Cron endpoint rejects requests without the correct secret (401) and syncs successfully with it.
- After deployment is restored and the workflow is live, confirm `Email` rows appear in the admin inbox without any manual click, and `EmailSyncState.lastSyncAt` advances on its own.
