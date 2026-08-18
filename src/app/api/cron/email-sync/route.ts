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
