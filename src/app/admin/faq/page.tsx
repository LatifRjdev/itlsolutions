import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FaqTable } from "./FaqTable";

export default async function AdminFaqPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const faqs = await prisma.faqItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">FAQ Management</h1>
        <p className="text-[var(--foreground-secondary)] mt-1">
          Manage frequently asked questions for the chatbox
        </p>
      </div>

      <FaqTable faqs={faqs} />
    </div>
  );
}
