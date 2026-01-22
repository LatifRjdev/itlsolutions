import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmailDetail } from "./EmailDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmailDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const email = await prisma.email.findUnique({
    where: { id },
    include: { attachments: true },
  });

  if (!email) {
    notFound();
  }

  // Mark as read
  if (!email.isRead) {
    await prisma.email.update({
      where: { id },
      data: { isRead: true },
    });
  }

  return <EmailDetail email={{ ...email, isRead: true }} />;
}
