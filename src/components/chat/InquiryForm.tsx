"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface InquiryFormProps {
  onBack: () => void;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function InquiryForm({ onBack }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const locale = useLocale();
  const t = useTranslations("chat");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/chat-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, locale }),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-[var(--foreground)] font-medium mb-2">
          {t("success")}
        </p>
        <button
          onClick={onBack}
          className="text-[var(--primary)] text-sm hover:underline"
        >
          {t("backToFaq")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--primary)] mb-4 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToFaq")}
      </button>

      <h4 className="text-sm font-medium text-[var(--foreground)] mb-4">
        {t("contactUs")}
      </h4>

      {status === "error" && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {t("error")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name")}
            required
            className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors text-sm"
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            required
            className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors text-sm"
          />
        </div>
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("message")}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors text-sm resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("sending")}
            </>
          ) : (
            t("send")
          )}
        </button>
      </form>
    </div>
  );
}
