import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncFolder } from "@/lib/imap";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "INBOX";

  try {
    const syncedCount = await syncFolder(folder);
    return NextResponse.json({
      success: true,
      syncedCount,
      folder,
    });
  } catch (error) {
    console.error("Email sync failed:", error);
    return NextResponse.json(
      { error: "Failed to sync emails", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
