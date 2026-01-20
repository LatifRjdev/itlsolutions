import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "./ProjectForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Add Project
        </h1>
        <ProjectForm />
      </div>
    );
  }

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
        Edit Project
      </h1>
      <ProjectForm project={project} />
    </div>
  );
}
