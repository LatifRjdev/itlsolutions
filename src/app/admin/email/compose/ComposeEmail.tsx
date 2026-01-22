"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, X, ArrowLeft } from "lucide-react";
import type { Email } from "@/generated/prisma/client";

interface ComposeEmailProps {
  replyToEmail?: Email | null;
  replyType?: "reply" | "reply-all" | "forward" | null;
}

export function ComposeEmail({ replyToEmail, replyType }: ComposeEmailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getInitialTo = () => {
    if (!replyToEmail || !replyType) return "";
    if (replyType === "forward") return "";
    return replyToEmail.from;
  };

  const getInitialCc = () => {
    if (!replyToEmail || replyType !== "reply-all") return "";
    const userEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS || "";
    return replyToEmail.to.filter((t) => t !== userEmail).join(", ");
  };

  const getInitialSubject = () => {
    if (!replyToEmail) return "";
    const prefix = replyType === "forward" ? "Fwd: " : "Re: ";
    const subject = replyToEmail.subject.replace(/^(Re|Fwd|Fw):\s*/gi, "");
    return prefix + subject;
  };

  const getInitialBody = () => {
    if (!replyToEmail) return "";
    const originalDate = new Date(replyToEmail.date).toLocaleString();
    const header =
      replyType === "forward"
        ? `\n\n---------- Forwarded message ----------\nFrom: ${replyToEmail.fromName || replyToEmail.from}\nDate: ${originalDate}\nSubject: ${replyToEmail.subject}\nTo: ${replyToEmail.to.join(", ")}\n\n`
        : `\n\nOn ${originalDate}, ${replyToEmail.fromName || replyToEmail.from} wrote:\n`;

    const quotedBody =
      replyType === "forward"
        ? replyToEmail.textBody || ""
        : (replyToEmail.textBody || "")
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n");

    return header + quotedBody;
  };

  const [formData, setFormData] = useState({
    to: getInitialTo(),
    cc: getInitialCc(),
    bcc: "",
    subject: getInitialSubject(),
    body: getInitialBody(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.to
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean),
          cc: formData.cc
            ? formData.cc
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean)
            : undefined,
          bcc: formData.bcc
            ? formData.bcc
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean)
            : undefined,
          subject: formData.subject,
          html: formData.body.replace(/\n/g, "<br>"),
          text: formData.body,
          ...(replyToEmail && {
            inReplyTo: replyToEmail.messageId,
            references: [...(replyToEmail.references || []), replyToEmail.messageId],
          }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/email?folder=Sent");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Email Sent Successfully!
        </h2>
        <p className="text-[var(--foreground-secondary)]">
          Redirecting to Sent folder...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
        <div className="flex items-center px-4">
          <label className="w-16 text-sm text-[var(--foreground-secondary)]">To:</label>
          <input
            type="text"
            value={formData.to}
            onChange={(e) => setFormData((prev) => ({ ...prev, to: e.target.value }))}
            className="flex-1 px-2 py-3 bg-transparent text-[var(--foreground)] focus:outline-none"
            placeholder="recipient@example.com"
            required
          />
        </div>

        <div className="flex items-center px-4">
          <label className="w-16 text-sm text-[var(--foreground-secondary)]">Cc:</label>
          <input
            type="text"
            value={formData.cc}
            onChange={(e) => setFormData((prev) => ({ ...prev, cc: e.target.value }))}
            className="flex-1 px-2 py-3 bg-transparent text-[var(--foreground)] focus:outline-none"
            placeholder="cc@example.com"
          />
        </div>

        <div className="flex items-center px-4">
          <label className="w-16 text-sm text-[var(--foreground-secondary)]">Bcc:</label>
          <input
            type="text"
            value={formData.bcc}
            onChange={(e) => setFormData((prev) => ({ ...prev, bcc: e.target.value }))}
            className="flex-1 px-2 py-3 bg-transparent text-[var(--foreground)] focus:outline-none"
            placeholder="bcc@example.com"
          />
        </div>

        <div className="flex items-center px-4">
          <label className="w-16 text-sm text-[var(--foreground-secondary)]">
            Subject:
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="flex-1 px-2 py-3 bg-transparent text-[var(--foreground)] focus:outline-none"
            placeholder="Email subject"
            required
          />
        </div>

        <div className="p-4">
          <textarea
            value={formData.body}
            onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
            rows={15}
            className="w-full bg-transparent text-[var(--foreground)] focus:outline-none resize-none"
            placeholder="Write your message..."
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 font-medium"
        >
          <Send className="w-4 h-4" />
          {loading ? "Sending..." : "Send Email"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--foreground-secondary)]"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}
