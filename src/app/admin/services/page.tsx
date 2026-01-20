import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { ServicesTable } from "./ServicesTable";

export default async function AdminServicesPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Services
          </h1>
          <p className="text-[var(--foreground-secondary)] mt-1">
            Manage your company services
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </Link>
      </div>

      <ServicesTable services={services} />
    </div>
  );
}
