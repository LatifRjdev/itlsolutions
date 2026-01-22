import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmailClient } from "./EmailClient";

interface PageProps {
  searchParams: Promise<{ folder?: string; page?: string; search?: string }>;
}

export default async function AdminEmailPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const folder = params.folder || "INBOX";
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const limit = 50;

  const where = search
    ? {
        isDeleted: false,
        OR: [
          { subject: { contains: search, mode: "insensitive" as const } },
          { from: { contains: search, mode: "insensitive" as const } },
          { fromName: { contains: search, mode: "insensitive" as const } },
          { snippet: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {
        folder,
        isDeleted: false,
      };

  const [emails, total, unreadCount, lastSync] = await Promise.all([
    prisma.email.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        attachments: { select: { id: true, filename: true } },
      },
    }),
    prisma.email.count({ where }),
    prisma.email.count({ where: { folder: "INBOX", isRead: false, isDeleted: false } }),
    prisma.emailSyncState.findUnique({ where: { folder: "INBOX" } }),
  ]);

  const folders = [
    { name: "INBOX", label: "Inbox", count: unreadCount },
    { name: "Sent", label: "Sent", count: 0 },
    { name: "Trash", label: "Trash", count: 0 },
  ];

  return (
    <EmailClient
      emails={emails}
      folders={folders}
      currentFolder={folder}
      search={search}
      pagination={{
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }}
      lastSyncAt={lastSync?.lastSyncAt?.toISOString() || null}
    />
  );
}
