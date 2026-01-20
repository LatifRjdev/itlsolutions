"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import type { Service } from "@/generated/prisma/client";

interface ServicesTableProps {
  services: Service[];
}

export function ServicesTable({ services }: ServicesTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/services/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete service");
    }
  };

  return (
    <DataTable
      data={services}
      basePath="/admin/services"
      onDelete={handleDelete}
      viewPath={(service) => `/services#${service.slug}`}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        {
          key: "icon",
          label: "Icon",
          render: (service) => (
            <span className="text-[var(--foreground-secondary)]">
              {service.icon}
            </span>
          ),
        },
        {
          key: "order",
          label: "Order",
          render: (service) => (
            <span className="text-[var(--foreground-secondary)]">
              {service.order}
            </span>
          ),
        },
      ]}
    />
  );
}
