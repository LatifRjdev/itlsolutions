import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { TeamTable } from "./TeamTable";

export default async function AdminTeamPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Team</h1>
          <p className="text-[var(--foreground-secondary)] mt-1">
            Manage team members
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </Link>
      </div>

      <TeamTable members={members} />
    </div>
  );
}
