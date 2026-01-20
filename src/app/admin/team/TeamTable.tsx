"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import type { TeamMember } from "@/generated/prisma/client";

interface TeamTableProps {
  members: TeamMember[];
}

export function TeamTable({ members }: TeamTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/team/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete team member");
    }
  };

  return (
    <DataTable
      data={members}
      basePath="/admin/team"
      onDelete={handleDelete}
      viewPath={() => "/team"}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "department", label: "Department" },
        { key: "order", label: "Order" },
      ]}
    />
  );
}
