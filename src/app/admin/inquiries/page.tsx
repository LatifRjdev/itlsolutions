import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InquiriesTable } from "./InquiriesTable";

export default async function AdminInquiriesPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const inquiries = await prisma.chatInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Chat Inquiries
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 text-sm bg-[var(--primary)] text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </h1>
        <p className="text-[var(--foreground-secondary)] mt-1">
          Messages from chatbox visitors who need assistance
        </p>
      </div>

      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
