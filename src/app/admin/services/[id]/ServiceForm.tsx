"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Service } from "@/generated/prisma/client";

interface ServiceFormProps {
  service?: Service;
}

const iconOptions = [
  "Cloud",
  "Code",
  "Shield",
  "BarChart",
  "Users",
  "Settings",
  "Database",
  "Globe",
  "Lock",
  "Zap",
];

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: service?.title || "",
    slug: service?.slug || "",
    description: service?.description || "",
    icon: service?.icon || "Code",
    features: service?.features.join("\n") || "",
    order: service?.order || 0,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = service
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";
      const method = service ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: formData.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save service");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Icon
          </label>
          <select
            value={formData.icon}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, icon: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Features (one per line)
          </label>
          <textarea
            value={formData.features}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, features: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Display Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : service ? "Update Service" : "Create Service"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
