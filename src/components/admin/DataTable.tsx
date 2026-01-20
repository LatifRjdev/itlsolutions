"use client";

import { useState } from "react";
import { Trash2, Edit, Eye } from "lucide-react";
import Link from "next/link";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  basePath: string;
  onDelete?: (id: string) => Promise<void>;
  viewPath?: (item: T) => string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  basePath,
  onDelete,
  viewPath,
}: DataTableProps<T>) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this item?")) return;

    setDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setDeleting(null);
    }
  };

  const getValue = (item: T, key: string): unknown => {
    const keys = key.split(".");
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--background)]">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]"
              >
                {column.label}
              </th>
            ))}
            <th className="text-right px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-8 text-center text-[var(--foreground-secondary)]"
              >
                No items found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-[var(--foreground)]"
                  >
                    {column.render
                      ? column.render(item)
                      : String(getValue(item, String(column.key)) ?? "")}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {viewPath && (
                      <Link
                        href={viewPath(item)}
                        target="_blank"
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href={`${basePath}/${item.id}`}
                      className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
