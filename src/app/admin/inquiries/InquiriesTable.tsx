"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  MailOpen,
  Trash2,
  X,
  Eye,
  Clock,
  Globe,
  User,
  MessageSquare,
} from "lucide-react";
import type { ChatInquiry } from "@/generated/prisma/client";

interface InquiriesTableProps {
  inquiries: ChatInquiry[];
}

export function InquiriesTable({ inquiries }: InquiriesTableProps) {
  const router = useRouter();
  const [selectedInquiry, setSelectedInquiry] = useState<ChatInquiry | null>(
    null
  );

  const handleMarkRead = async (id: string, isRead: boolean) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    setSelectedInquiry(null);
    router.refresh();
  };

  const openModal = async (inquiry: ChatInquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.isRead) {
      await handleMarkRead(inquiry.id, true);
    }
  };

  return (
    <>
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Status
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Message
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Date
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-[var(--foreground-secondary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-[var(--foreground-secondary)]"
                >
                  No inquiries yet
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors cursor-pointer ${
                    !inquiry.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                  onClick={() => openModal(inquiry)}
                >
                  <td className="px-6 py-4">
                    {inquiry.isRead ? (
                      <MailOpen className="w-5 h-5 text-[var(--foreground-secondary)]" />
                    ) : (
                      <Mail className="w-5 h-5 text-[var(--primary)]" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        !inquiry.isRead
                          ? "font-semibold text-[var(--foreground)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {inquiry.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)]">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)] max-w-[250px] truncate">
                    {inquiry.message}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)]">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openModal(inquiry)}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleMarkRead(inquiry.id, !inquiry.isRead)
                        }
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors"
                        title={inquiry.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        {inquiry.isRead ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <MailOpen className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
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

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedInquiry(null)}
          />
          <div className="relative bg-[var(--surface)] rounded-xl border border-[var(--border)] w-full max-w-lg m-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Inquiry Details
              </h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--foreground-secondary)]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {selectedInquiry.name}
                  </p>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-[var(--foreground-secondary)]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {selectedInquiry.locale.toUpperCase()}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-[var(--foreground-secondary)] mt-1" />
                  <span className="text-sm font-medium text-[var(--foreground-secondary)]">
                    Message
                  </span>
                </div>
                <p className="text-[var(--foreground)] whitespace-pre-wrap bg-[var(--background)] p-4 rounded-lg">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry to ITL Solutions`}
                  className="flex-1 py-2 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-center font-medium transition-colors"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="py-2 px-4 border border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
