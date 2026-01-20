"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { BlogPost } from "@/generated/prisma/client";

interface BlogPostFormProps {
  post?: BlogPost;
}

const categories = ["Cloud", "AI & ML", "Security", "Architecture", "DevOps", "Analytics", "Mobile", "Web"];

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || categories[0],
    image: post?.image || "/images/blog/placeholder.jpg",
    readTime: post?.readTime || 5,
    published: post?.published || false,
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
      const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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

        <div className="grid grid-cols-3 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Read Time (min)
            </label>
            <input
              type="number"
              min="1"
              value={formData.readTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  readTime: parseInt(e.target.value) || 5,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={12}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Featured Image
          </label>
          <ImageUpload
            value={formData.image}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, image: url }))
            }
            folder="blog"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
            className="rounded"
          />
          <label htmlFor="published" className="text-sm text-[var(--foreground)]">
            Publish immediately
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : post ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
