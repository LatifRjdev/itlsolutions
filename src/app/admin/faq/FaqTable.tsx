"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import type { FaqItem } from "@/generated/prisma/client";

interface FaqTableProps {
  faqs: FaqItem[];
}

interface FormData {
  question: string;
  answer: string;
  questionRu: string;
  answerRu: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: FormData = {
  question: "",
  answer: "",
  questionRu: "",
  answerRu: "",
  category: "",
  sortOrder: 0,
  isActive: true,
};

export function FaqTable({ faqs }: FaqTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (faq?: FaqItem) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        questionRu: faq.questionRu || "",
        answerRu: faq.answerRu || "",
        category: faq.category || "",
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({ ...emptyForm, sortOrder: faqs.length });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/admin/faq/${editingId}` : "/api/admin/faq";
      const method = editingId ? "PATCH" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          questionRu: formData.questionRu || null,
          answerRu: formData.answerRu || null,
          category: formData.category || null,
        }),
      });

      closeModal();
      router.refresh();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const toggleActive = async (faq: FaqItem) => {
    await fetch(`/api/admin/faq/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !faq.isActive }),
    });
    router.refresh();
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Order
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Question (EN)
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Question (RU)
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Status
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-[var(--foreground-secondary)]"
                >
                  No FAQ items yet. Click &quot;Add FAQ&quot; to create one.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr
                  key={faq.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors"
                >
                  <td className="px-6 py-4 text-[var(--foreground)]">
                    {faq.sortOrder}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground)] max-w-[300px] truncate">
                    {faq.question}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)] max-w-[300px] truncate">
                    {faq.questionRu || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        faq.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}
                    >
                      {faq.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(faq)}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors"
                        title={faq.isActive ? "Deactivate" : "Activate"}
                      >
                        {faq.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openModal(faq)}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div className="relative bg-[var(--surface)] rounded-xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {editingId ? "Edit FAQ" : "Add FAQ"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--foreground-secondary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Question (EN) *
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    required
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Question (RU)
                  </label>
                  <input
                    type="text"
                    value={formData.questionRu}
                    onChange={(e) =>
                      setFormData({ ...formData, questionRu: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Answer (EN) *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Answer (RU)
                </label>
                <textarea
                  value={formData.answerRu}
                  onChange={(e) =>
                    setFormData({ ...formData, answerRu: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., General, Pricing, Support"
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-[var(--foreground)]"
                >
                  Active (visible in chatbox)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-[var(--foreground-secondary)] hover:bg-[var(--background)] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
