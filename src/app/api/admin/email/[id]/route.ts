import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markEmailRead, deleteEmailOnServer } from "@/lib/imap";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const email = await prisma.email.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Auto-mark as read when opened
    if (!email.isRead) {
      await prisma.email.update({
        where: { id },
        data: { isRead: true },
      });

      // Sync to IMAP server (don't block on errors)
      try {
        if (email.uid > 0) {
          await markEmailRead(email.uid, email.folder, true);
        }
      } catch (error) {
        console.error("Failed to sync read status to IMAP:", error);
      }
    }

    return NextResponse.json(email);
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const email = await prisma.email.findUnique({ where: { id } });
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (typeof body.isRead === "boolean") {
      updateData.isRead = body.isRead;
      // Sync to IMAP
      try {
        if (email.uid > 0) {
          await markEmailRead(email.uid, email.folder, body.isRead);
        }
      } catch (error) {
        console.error("Failed to sync read status:", error);
      }
    }

    if (typeof body.isStarred === "boolean") {
      updateData.isStarred = body.isStarred;
    }

    const updated = await prisma.email.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const email = await prisma.email.findUnique({ where: { id } });
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Soft delete locally
    await prisma.email.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Move to Trash on IMAP server
    try {
      if (email.uid > 0) {
        await deleteEmailOnServer(email.uid, email.folder);
      }
    } catch (error) {
      console.error("Failed to delete on IMAP server:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json({ error: "Failed to delete email" }, { status: 500 });
  }
}
