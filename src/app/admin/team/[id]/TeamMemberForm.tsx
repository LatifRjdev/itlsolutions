"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { TeamMember } from "@/generated/prisma/client";

interface TeamMemberFormProps {
  member?: TeamMember;
}

export function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: member?.name || "",
    slug: member?.slug || "",
    role: member?.role || "",
    department: member?.department || "",
    bio: member?.bio || "",
    image: member?.image || "/images/team/placeholder.jpg",
    linkedin: member?.linkedin || "",
    github: member?.github || "",
    order: member?.order || 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = member ? `/api/admin/team/${member.id}` : "/api/admin/team";
      const method = member ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      router.push("/admin/team");
      router.refresh();
    } catch {
      setError("Failed to save team member");
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: prev.slug || generateSlug(e.target.value),
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
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
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Photo
          </label>
          <ImageUpload
            value={formData.image}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, image: url }))
            }
            folder="team"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, github: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            />
          </div>
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
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : member ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/team")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
