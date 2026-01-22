import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComposeEmail } from "./ComposeEmail";

interface PageProps {
  searchParams: Promise<{
    replyTo?: string;
    replyAll?: string;
    forward?: string;
  }>;
}

export default async function ComposePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  let replyToEmail = null;
  let replyType: "reply" | "reply-all" | "forward" | null = null;

  if (params.replyTo) {
    replyToEmail = await prisma.email.findUnique({
      where: { id: params.replyTo },
    });
    replyType = "reply";
  } else if (params.replyAll) {
    replyToEmail = await prisma.email.findUnique({
      where: { id: params.replyAll },
    });
    replyType = "reply-all";
  } else if (params.forward) {
    replyToEmail = await prisma.email.findUnique({
      where: { id: params.forward },
    });
    replyType = "forward";
  }

  const title = replyType === "forward"
    ? "Forward Email"
    : replyType
      ? "Reply"
      : "Compose Email";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
      </div>
      <ComposeEmail
        replyToEmail={replyToEmail ? JSON.parse(JSON.stringify(replyToEmail)) : null}
        replyType={replyType}
      />
    </div>
  );
}
