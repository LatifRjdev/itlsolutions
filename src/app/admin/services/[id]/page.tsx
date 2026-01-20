import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "./ServiceForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Add New Service
        </h1>
        <ServiceForm />
      </div>
    );
  }

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
        Edit Service
      </h1>
      <ServiceForm service={service} />
    </div>
  );
}
