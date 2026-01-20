"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ status: "loading", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormState({ status: "success", message: data.message });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setFormState({
          status: "error",
          message: data.message || "Something went wrong",
        });
      }
    } catch {
      setFormState({
        status: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="w-full h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="w-full h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--foreground)]">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@company.com"
          required
          className="w-full h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--foreground)]">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="How can we help?"
          className="w-full h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--foreground)]">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your project..."
          required
          minLength={10}
          className="w-full p-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none resize-none transition-colors"
        />
      </div>

      {formState.status === "success" && (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span>{formState.message}</span>
        </div>
      )}

      {formState.status === "error" && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{formState.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={formState.status === "loading"}
        className="w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {formState.status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
