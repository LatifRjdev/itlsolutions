# Admin Email Inbox Sync Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get `/admin/email` reliably showing incoming mail again — restore Vercel deploys, remove the build-time DB risk, surface sync failures instead of hiding them, and add unattended scheduled sync.

**Architecture:** No changes to the IMAP sync algorithm itself. Fix the deployment pipeline (manual), harden the build script, add error state to the existing admin email client component, and add a secret-protected cron endpoint driven by a GitHub Actions scheduled workflow (chosen over Vercel Cron because the project is on Vercel's Hobby plan, which caps cron at once/day).

**Tech Stack:** Next.js 16 App Router API routes, Prisma, `imapflow`, GitHub Actions.

**Reference spec:** [docs/superpowers/specs/2026-08-18-email-inbox-sync-fix-design.md](../specs/2026-08-18-email-inbox-sync-fix-design.md)

---

## Note on testing approach

This project has no test runner installed (no Jest/Vitest config, no `*.test.*` files anywhere in `src/`). Adding one is out of scope for this fix. Verification steps below use `npm run build`, `npm run lint`, and manual `curl`/browser checks instead of automated unit tests — this matches the codebase's existing (test-free) convention rather than introducing a new one unilaterally.

---

### Task 1: Restore the Vercel deployment (manual, no code)

This is a prerequisite — none of the code changes below reach production until deploys work again. Do this first so later tasks can be verified live if desired, but it does not block writing/committing the code changes.

- [ ] **Step 1: Check Vercel Git integration**

Go to `vercel.com` → the `itlsolutions` project → **Settings → Git**. Confirm:
- A GitHub repository is connected (should be `LatifRjdev/itlsolutions`).
- **Production Branch** is set to `main`.

- [ ] **Step 2: Check GitHub App access**

On GitHub: `github.com/settings/installations` → find "Vercel" → confirm it still has access to the `itlsolutions` repo (access can get silently revoked if repo permissions changed, org settings changed, or the app was reinstalled).

- [ ] **Step 3: Force a fresh deployment**

If the integration looks fine but deploys still aren't triggering automatically, do a manual redeploy to confirm the pipeline itself works end to end:

```bash
git commit --allow-empty -m "chore: trigger Vercel redeploy"
git push origin main
```

Watch the Vercel Deployments tab — a new deployment should appear within ~30 seconds of the push. If it doesn't, reconnect the Git integration from Vercel's project settings (disconnect, then reconnect and re-select the repo).

- [ ] **Step 4: Confirm the fix**

Once a new deployment goes `Ready`, open `https://itlsolutions.net/admin/email` and confirm the "Sync" button (with the refresh icon, next to the search box) is now visible in the toolbar. This is the visual proof production is finally serving current `main`.

---

### Task 2: Remove `db push`/`db seed` from the production build

**Files:**
- Modify: `package.json:6`

Every Vercel build currently runs a schema push and re-seeds the database. If the database is briefly unreachable during the build (Neon suspends on idle), the whole deployment fails — this is a plausible second cause of the stalled deploys. It's also just unsafe to re-run seed data on every production build.

- [ ] **Step 1: Confirm `next build` alone doesn't need a live database**

```bash
npx next build
```

Expected: build completes successfully (it already does — verified during investigation; the app's DB-backed pages are server-rendered on demand, not statically generated from Prisma queries at build time).

- [ ] **Step 2: Edit the build script**

In `package.json`, change:

```diff
-    "build": "prisma generate && prisma db push && prisma db seed && next build",
+    "build": "prisma generate && next build",
```

`db:push` and `db:seed` scripts already exist further down in the same `scripts` block — leave those as-is; they're now the explicit, deliberate way to apply schema changes or seed data (run manually, e.g. after a migration).

- [ ] **Step 3: Verify the full build script works**

```bash
npm run build
```

Expected: succeeds without attempting to reach the database via `db push`/`db seed`.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "fix: remove db push/seed from production build script

Running schema push and reseed on every Vercel build risked failing
the entire deploy whenever the database was briefly unreachable
(Neon suspends on idle), and unconditionally reseeding prod on every
build is unsafe regardless. db:push and db:seed remain available as
explicit manual scripts."
```

---

### Task 3: Add `maxDuration` to the manual sync route

**Files:**
- Modify: `src/app/api/admin/email/sync/route.ts:1-5`

Without an explicit `maxDuration`, this route is subject to the platform's default serverless function timeout. A large backlog of unsynced mail can get killed mid-batch, silently, before `emailSyncState.lastSyncAt` is ever updated — which is consistent with the stale timestamp this whole investigation started from.

- [ ] **Step 1: Add the export**

In `src/app/api/admin/email/sync/route.ts`, change:

```diff
 import { NextRequest, NextResponse } from "next/server";
 import { auth } from "@/lib/auth";
 import { syncFolder } from "@/lib/imap";
+
+export const maxDuration = 60;

 export async function POST(request: NextRequest) {
```

- [ ] **Step 2: Verify it builds and lints**

```bash
npm run lint
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/email/sync/route.ts
git commit -m "fix: cap manual email sync route at 60s instead of platform default"
```

---

### Task 4: Surface sync errors in the admin email UI

**Files:**
- Modify: `src/app/admin/email/EmailClient.tsx:52-76` (state + `handleSync`)
- Modify: `src/app/admin/email/EmailClient.tsx:150-176` (toolbar — insert error banner)

Currently a failed sync just stops the spinner with no feedback, so a broken IMAP connection looks identical to "no new mail."

- [ ] **Step 1: Add error state and update `handleSync`**

In `src/app/admin/email/EmailClient.tsx`, change:

```diff
   const router = useRouter();
   const [syncing, setSyncing] = useState(false);
   const [searchQuery, setSearchQuery] = useState(search);
+  const [syncError, setSyncError] = useState<string | null>(null);

   const handleSync = async () => {
     setSyncing(true);
+    setSyncError(null);
     try {
       const res = await fetch(`/api/admin/email/sync?folder=${currentFolder}`, {
         method: "POST",
       });
       if (res.ok) {
         router.refresh();
+      } else {
+        const data = await res.json().catch(() => null);
+        setSyncError(data?.details || data?.error || "Sync failed");
       }
+    } catch {
+      setSyncError("Network error while syncing");
     } finally {
       setSyncing(false);
     }
   };
```

- [ ] **Step 2: Render the error banner below the toolbar**

In the same file, the toolbar `<div>` block currently ends and is immediately followed by the "Email List" comment:

```tsx
          </button>
        </div>

        {/* Email List */}
```

Change it to insert a banner between the toolbar and the email list:

```diff
           </button>
         </div>

+        {syncError && (
+          <div className="flex items-center justify-between px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-700">
+            <span>Sync failed: {syncError}</span>
+            <button
+              onClick={() => setSyncError(null)}
+              className="text-red-700 hover:underline"
+            >
+              Dismiss
+            </button>
+          </div>
+        )}
+
         {/* Email List */}
```

- [ ] **Step 3: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3003/admin/email`, log in, temporarily set `IMAP_PASS` in `.env` to an incorrect value, restart the dev server, click "Sync". Expected: a red banner appears reading "Sync failed: ..." instead of the spinner just silently stopping. Restore the correct `IMAP_PASS` afterward and confirm clicking "Sync" again clears the banner (via the `setSyncError(null)` at the start of `handleSync`) and works normally.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/email/EmailClient.tsx
git commit -m "fix: show a visible error banner when email sync fails

Previously a failed sync (bad IMAP credentials, network error, etc.)
just silently stopped the spinner with no feedback, indistinguishable
from a healthy sync that found nothing new."
```

---

### Task 5: Add a secret-protected cron sync endpoint

**Files:**
- Create: `src/app/api/cron/email-sync/route.ts`

This is the endpoint the scheduled GitHub Actions workflow (Task 7) will call. It reuses the existing `syncFolder` function — no changes to the IMAP logic.

- [ ] **Step 1: Create the route**

```typescript
// src/app/api/cron/email-sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { syncFolder } from "@/lib/imap";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const syncedCount = await syncFolder("INBOX");
    return NextResponse.json({ success: true, syncedCount });
  } catch (error) {
    console.error("Cron email sync failed:", error);
    return NextResponse.json(
      { error: "Failed to sync emails", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

This intentionally fails closed: if `CRON_SECRET` isn't set at all, every request is rejected (500) rather than the check silently comparing against `undefined`.

- [ ] **Step 2: Add `CRON_SECRET` to `.env.example`**

In `.env.example`, after the `EMAIL_TO` line, add:

```diff
 # Notification recipient for contact form + chat inquiries
 EMAIL_TO="info@itlsolutions.net"
+
+# Cron authentication (for the scheduled GitHub Actions email-sync workflow)
+# Generate: openssl rand -base64 32
+# Must match the CRON_SECRET set in GitHub Actions repo secrets.
+CRON_SECRET="your-cron-secret-here"
```

- [ ] **Step 3: Generate a real secret and set it locally + on Vercel**

```bash
openssl rand -base64 32
```

Add the generated value as `CRON_SECRET` to your local `.env`, and add the same value to Vercel → Project → Settings → Environment Variables (all environments).

- [ ] **Step 4: Verify locally**

```bash
npm run dev
```

In another terminal:

```bash
curl -i http://localhost:3003/api/cron/email-sync
```

Expected: `401 Unauthorized` (no header sent).

```bash
curl -i http://localhost:3003/api/cron/email-sync \
  -H "Authorization: Bearer $(grep CRON_SECRET .env | cut -d '=' -f2 | tr -d '\"')"
```

Expected: `200 OK` with `{"success":true,"syncedCount":N}`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/email-sync/route.ts .env.example
git commit -m "feat: add secret-protected cron endpoint for scheduled email sync"
```

---

### Task 6: Add the GitHub Actions scheduled workflow

**Files:**
- Create: `.github/workflows/email-sync.yml`

- [ ] **Step 1: Add `CRON_SECRET` and `PRODUCTION_URL` as GitHub Actions repo secrets**

On GitHub: repo → **Settings → Secrets and variables → Actions → New repository secret**.
- `CRON_SECRET` — same value set in Vercel in Task 5, Step 3.
- `PRODUCTION_URL` — `https://itlsolutions.net`

- [ ] **Step 2: Create the workflow file**

```yaml
# .github/workflows/email-sync.yml
name: Email Inbox Sync

on:
  schedule:
    - cron: "*/5 * * * *"
  workflow_dispatch: {}

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Call cron sync endpoint
        run: |
          response=$(curl -s -w "\n%{http_code}" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            "${{ secrets.PRODUCTION_URL }}/api/cron/email-sync")
          status_code=$(echo "$response" | tail -n1)
          body=$(echo "$response" | sed '$d')
          echo "Response: $body"
          if [ "$status_code" -ge 400 ]; then
            echo "Sync failed with status $status_code"
            exit 1
          fi
```

`workflow_dispatch` is included so it can be triggered manually from the Actions tab for testing, without waiting for the schedule.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/email-sync.yml
git commit -m "feat: schedule email inbox sync every 5 minutes via GitHub Actions

Vercel Cron is capped at once/day on the Hobby plan, so scheduling
lives in GitHub Actions instead, calling the cron-protected endpoint
added in the previous commit."
```

- [ ] **Step 4: Push and verify end to end**

```bash
git push origin main
```

Once Task 1's deployment is confirmed working and this push has deployed: go to the repo's **Actions** tab, select "Email Inbox Sync", click **Run workflow** to trigger it manually, and confirm the run succeeds (green check). Then open `https://itlsolutions.net/admin/email` and confirm `Last sync:` shows the current time without anyone having clicked the Sync button.

---

## Self-Review Notes

- **Spec coverage:** Task 1 → spec issue #1 (stalled deploy). Task 2 → spec issue #2 (unsafe build script). Task 4 → spec issue #3 (silent failures). Tasks 5–6 → spec issue #4 (no automatic sync). Task 3 covers the `maxDuration` follow-up called out in the spec's Task 4 section.
- **Type/naming consistency:** `syncFolder("INBOX")` signature (from `src/lib/imap.ts`) matches usage in both the existing manual route and the new cron route. `syncError` / `setSyncError` naming is local to `EmailClient.tsx` and doesn't collide with existing `syncing` state.
- **No placeholders:** all code blocks are complete; the only human-in-the-loop values are the actual secret strings, which can't be known in advance and are generated in Task 5 Step 3.
