"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Star,
  Paperclip,
  MailOpen,
  Mail,
} from "lucide-react";
import type { Email, EmailAttachment } from "@/generated/prisma/client";

interface EmailWithAttachments extends Email {
  attachments: EmailAttachment[];
}

interface EmailDetailProps {
  email: EmailWithAttachments;
}

export function EmailDetail({ email }: EmailDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [isStarred, setIsStarred] = useState(email.isStarred);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/email/${email.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/email");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStar = async () => {
    const newStarred = !isStarred;
    setIsStarred(newStarred);

    await fetch(`/api/admin/email/${email.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isStarred: newStarred }),
    });
  };

  const handleMarkUnread = async () => {
    await fetch(`/api/admin/email/${email.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: false }),
    });
    router.push("/admin/email");
    router.refresh();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground-secondary)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-[var(--foreground)] truncate max-w-xl">
            {email.subject}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/email/compose?replyTo=${email.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground-secondary)]"
            title="Reply"
          >
            <Reply className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/email/compose?replyAll=${email.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground-secondary)]"
            title="Reply All"
          >
            <ReplyAll className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/email/compose?forward=${email.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground-secondary)]"
            title="Forward"
          >
            <Forward className="w-4 h-4" />
          </Link>
          <button
            onClick={handleToggleStar}
            className="p-2 rounded-lg hover:bg-[var(--background)] transition-colors"
            title={isStarred ? "Unstar" : "Star"}
          >
            <Star
              className={`w-4 h-4 ${
                isStarred ? "fill-yellow-400 text-yellow-400" : "text-[var(--foreground-secondary)]"
              }`}
            />
          </button>
          <button
            onClick={handleMarkUnread}
            className="p-2 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground-secondary)]"
            title="Mark as unread"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Info */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-lg">
              {(email.fromName || email.from).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">
                {email.fromName || email.from}
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">{email.from}</p>
              <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                To: {email.to.join(", ")}
                {email.cc.length > 0 && (
                  <span className="ml-2">Cc: {email.cc.join(", ")}</span>
                )}
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {formatDate(email.date)}
          </p>
        </div>
      </div>

      {/* Attachments */}
      {email.attachments.length > 0 && (
        <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center gap-2 flex-wrap">
            <Paperclip className="w-4 h-4 text-[var(--foreground-secondary)]" />
            <span className="text-sm text-[var(--foreground-secondary)]">
              {email.attachments.length} attachment(s):
            </span>
            {email.attachments.map((att) => (
              <span
                key={att.id}
                className="text-sm bg-[var(--surface)] px-2 py-1 rounded border border-[var(--border)] text-[var(--foreground)]"
              >
                {att.filename}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Email Body */}
      <div className="p-6">
        {email.htmlBody ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: email.htmlBody }}
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-[var(--foreground)]">
            {email.textBody}
          </pre>
        )}
      </div>

      {/* Quick Reply */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
        <Link
          href={`/admin/email/compose?replyTo=${email.id}`}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:bg-[var(--background)] transition-colors"
        >
          <Reply className="w-4 h-4" />
          Click here to reply
        </Link>
      </div>
    </div>
  );
}
