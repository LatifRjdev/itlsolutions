import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContactsTable } from "./ContactsTable";

export default async function AdminContactsPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Contact Submissions
        </h1>
        <p className="text-[var(--foreground-secondary)] mt-1">
          View and manage contact form submissions
        </p>
      </div>

      <ContactsTable contacts={contacts} />
    </div>
  );
}
