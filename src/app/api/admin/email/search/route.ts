import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const folder = searchParams.get("folder");
  const limit = parseInt(searchParams.get("limit") || "50");

  if (!query) {
    return NextResponse.json({ emails: [] });
  }

  try {
    const emails = await prisma.email.findMany({
      where: {
        isDeleted: false,
        ...(folder && { folder }),
        OR: [
          { subject: { contains: query, mode: "insensitive" } },
          { from: { contains: query, mode: "insensitive" } },
          { fromName: { contains: query, mode: "insensitive" } },
          { textBody: { contains: query, mode: "insensitive" } },
          { snippet: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { date: "desc" },
      take: limit,
      include: {
        attachments: {
          select: { id: true, filename: true, size: true },
        },
      },
    });

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error searching emails:", error);
    return NextResponse.json({ error: "Failed to search emails" }, { status: 500 });
  }
}
