"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Inbox,
  Send,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Mail,
  Paperclip,
  Star,
  Circle,
} from "lucide-react";
import type { Email, EmailAttachment } from "@/generated/prisma/client";

interface EmailWithAttachments extends Email {
  attachments: Pick<EmailAttachment, "id" | "filename">[];
}

interface Folder {
  name: string;
  label: string;
  count: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EmailClientProps {
  emails: EmailWithAttachments[];
  folders: Folder[];
  currentFolder: string;
  search: string;
  pagination: Pagination;
  lastSyncAt: string | null;
}

const folderIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  INBOX: Inbox,
  Sent: Send,
  Trash: Trash2,
};

export function EmailClient({
  emails,
  folders,
  currentFolder,
  search,
  pagination,
  lastSyncAt,
}: EmailClientProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(search);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/admin/email/sync?folder=${currentFolder}`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/email?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/admin/email");
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Folder Sidebar */}
      <aside className="w-56 border-r border-[var(--border)] p-4 flex flex-col">
        <Link
          href="/admin/email/compose"
          className="flex items-center justify-center gap-2 w-full bg-[var(--primary)] text-white px-4 py-3 rounded-lg hover:bg-[var(--primary)]/90 transition-colors mb-4 font-medium"
        >
          <Plus className="w-5 h-5" />
          Compose
        </Link>

        <nav className="flex-1 space-y-1">
          {folders.map((folder) => {
            const Icon = folderIcons[folder.name] || Inbox;
            const isActive = folder.name === currentFolder && !search;

            return (
              <Link
                key={folder.name}
                href={`/admin/email?folder=${folder.name}`}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--foreground-secondary)] hover:bg-[var(--background)]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {folder.label}
                </span>
                {folder.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20" : "bg-[var(--primary)] text-white"
                    }`}
                  >
                    {folder.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {lastSyncAt && (
          <p className="text-xs text-[var(--foreground-secondary)] px-4 mt-4">
            Last sync: {new Date(lastSyncAt).toLocaleString()}
          </p>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
              />
            </div>
          </form>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--background)] transition-colors disabled:opacity-50 text-[var(--foreground-secondary)]"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync"}
          </button>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-auto">
          {emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--foreground-secondary)]">
              <Mail className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">
                {search ? "No emails match your search" : "No emails in this folder"}
              </p>
              {currentFolder === "INBOX" && !search && (
                <button
                  onClick={handleSync}
                  className="mt-4 text-[var(--primary)] hover:underline"
                >
                  Click to sync emails
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {emails.map((email) => (
                <Link
                  key={email.id}
                  href={`/admin/email/${email.id}`}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-[var(--background)] transition-colors ${
                    !email.isRead ? "bg-[var(--primary)]/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 w-8">
                    {!email.isRead && (
                      <Circle className="w-2.5 h-2.5 fill-[var(--primary)] text-[var(--primary)]" />
                    )}
                    {email.isStarred && (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`truncate ${
                          !email.isRead
                            ? "font-semibold text-[var(--foreground)]"
                            : "text-[var(--foreground-secondary)]"
                        }`}
                      >
                        {email.fromName || email.from}
                      </span>
                      {email.hasAttachments && (
                        <Paperclip className="w-4 h-4 text-[var(--foreground-secondary)] flex-shrink-0" />
                      )}
                    </div>
                    <p
                      className={`truncate ${
                        !email.isRead
                          ? "font-medium text-[var(--foreground)]"
                          : "text-[var(--foreground-secondary)]"
                      }`}
                    >
                      {email.subject}
                    </p>
                    <p className="text-sm text-[var(--foreground-secondary)] truncate mt-0.5">
                      {email.snippet}
                    </p>
                  </div>

                  <span className="text-sm text-[var(--foreground-secondary)] flex-shrink-0">
                    {formatDate(email.date)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
            <span className="text-sm text-[var(--foreground-secondary)]">
              Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/admin/email?folder=${currentFolder}&page=${pagination.page - 1}`
                  )
                }
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm disabled:opacity-50 hover:bg-[var(--background)] transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/admin/email?folder=${currentFolder}&page=${pagination.page + 1}`
                  )
                }
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm disabled:opacity-50 hover:bg-[var(--background)] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
