"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Project } from "@/generated/prisma/client";

interface ProjectFormProps {
  project?: Project;
}

const categories = ["Fintech", "Healthcare", "E-commerce", "Logistics", "Education", "IoT", "SaaS"];

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    category: project?.category || categories[0],
    description: project?.description || "",
    content: project?.content || "",
    image: project?.image || "/images/portfolio/placeholder.jpg",
    technologies: project?.technologies.join(", ") || "",
    featured: project?.featured || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = project
        ? `/api/admin/portfolio/${project.id}`
        : "/api/admin/portfolio";
      const method = project ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      setError("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg">
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
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
                slug: prev.slug || generateSlug(e.target.value),
              }))
            }
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Short Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Full Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={6}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Image
          </label>
          <ImageUpload
            value={formData.image}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, image: url }))
            }
            folder="portfolio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, technologies: e.target.value }))
            }
            placeholder="React, Node.js, PostgreSQL"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, featured: e.target.checked }))
            }
            className="rounded"
          />
          <label htmlFor="featured" className="text-sm text-[var(--foreground)]">
            Featured project
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : project ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/portfolio")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
