"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import type { BlogPost } from "@/generated/prisma/client";

interface BlogTableProps {
  posts: BlogPost[];
}

export function BlogTable({ posts }: BlogTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/blog/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete post");
    }
  };

  return (
    <DataTable
      data={posts}
      basePath="/admin/blog"
      onDelete={handleDelete}
      viewPath={(post) => `/blog/${post.slug}`}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        {
          key: "published",
          label: "Status",
          render: (post) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.published
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
          ),
        },
        {
          key: "readTime",
          label: "Read Time",
          render: (post) => `${post.readTime} min`,
        },
      ]}
    />
  );
}
