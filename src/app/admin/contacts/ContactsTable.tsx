"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, MailOpen, Eye } from "lucide-react";
import type { ContactSubmission } from "@/generated/prisma/client";

interface ContactsTableProps {
  contacts: ContactSubmission[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const router = useRouter();
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);

  const handleMarkRead = async (id: string, read: boolean) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    router.refresh();
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
                Subject
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
            {contacts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-[var(--foreground-secondary)]"
                >
                  No contact submissions yet
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--background)] transition-colors ${
                    !contact.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    {contact.read ? (
                      <MailOpen className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Mail className="w-5 h-5 text-[var(--primary)]" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground)] font-medium">
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)]">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)]">
                    {contact.subject || "-"}
                  </td>
                  <td className="px-6 py-4 text-[var(--foreground-secondary)]">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          if (!contact.read) {
                            handleMarkRead(contact.id, true);
                          }
                        }}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMarkRead(contact.id, !contact.read)}
                        className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background)] transition-colors"
                        title={contact.read ? "Mark as unread" : "Mark as read"}
                      >
                        {contact.read ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <MailOpen className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
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
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-[var(--surface)] rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
              Contact Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-[var(--foreground-secondary)]">
                  Name
                </label>
                <p className="text-[var(--foreground)]">
                  {selectedContact.firstName} {selectedContact.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm text-[var(--foreground-secondary)]">
                  Email
                </label>
                <p className="text-[var(--foreground)]">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-[var(--primary)] hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </p>
              </div>
              {selectedContact.subject && (
                <div>
                  <label className="text-sm text-[var(--foreground-secondary)]">
                    Subject
                  </label>
                  <p className="text-[var(--foreground)]">
                    {selectedContact.subject}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-[var(--foreground-secondary)]">
                  Message
                </label>
                <p className="text-[var(--foreground)] whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>
              <div>
                <label className="text-sm text-[var(--foreground-secondary)]">
                  Received
                </label>
                <p className="text-[var(--foreground)]">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${
                  selectedContact.subject || "Contact Form"
                }`}
                className="flex-1 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-center hover:bg-[var(--primary-hover)] transition-colors"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
