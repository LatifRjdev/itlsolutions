"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import type { Project } from "@/generated/prisma/client";

interface PortfolioTableProps {
  projects: Project[];
}

export function PortfolioTable({ projects }: PortfolioTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/portfolio/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete project");
    }
  };

  return (
    <DataTable
      data={projects}
      basePath="/admin/portfolio"
      onDelete={handleDelete}
      viewPath={(project) => `/portfolio/${project.slug}`}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        {
          key: "featured",
          label: "Featured",
          render: (project) => (
            <span className={project.featured ? "text-green-500" : "text-gray-400"}>
              {project.featured ? "Yes" : "No"}
            </span>
          ),
        },
        {
          key: "publishedAt",
          label: "Published",
          render: (project) =>
            new Date(project.publishedAt).toLocaleDateString(),
        },
      ]}
    />
  );
}
