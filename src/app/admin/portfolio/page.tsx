import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { PortfolioTable } from "./PortfolioTable";

export default async function AdminPortfolioPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Portfolio</h1>
          <p className="text-[var(--foreground-secondary)] mt-1">
            Manage portfolio projects
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      <PortfolioTable projects={projects} />
    </div>
  );
}
