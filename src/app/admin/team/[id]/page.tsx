import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TeamMemberForm } from "./TeamMemberForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Add Team Member
        </h1>
        <TeamMemberForm />
      </div>
    );
  }

  const member = await prisma.teamMember.findUnique({ where: { id } });

  if (!member) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
        Edit Team Member
      </h1>
      <TeamMemberForm member={member} />
    </div>
  );
}
