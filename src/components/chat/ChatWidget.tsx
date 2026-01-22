"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { InquiryForm } from "./InquiryForm";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  questionRu: string | null;
  answerRu: string | null;
  category: string | null;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const locale = useLocale();
  const t = useTranslations("chat");

  useEffect(() => {
    if (isOpen && faqs.length === 0) {
      fetch("/api/faq")
        .then((res) => res.json())
        .then((data) => setFaqs(data))
        .catch(console.error);
    }
  }, [isOpen, faqs.length]);

  const getQuestion = (faq: FaqItem) => {
    if (locale === "ru" && faq.questionRu) {
      return faq.questionRu;
    }
    return faq.question;
  };

  const getAnswer = (faq: FaqItem) => {
    if (locale === "ru" && faq.answerRu) {
      return faq.answerRu;
    }
    return faq.answer;
  };

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
        aria-label={t("title")}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col max-h-[80vh] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--primary)] rounded-t-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{t("title")}</h3>
            <p className="text-white/70 text-xs">ITL Solutions</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!showForm ? (
          <>
            {/* FAQ Title */}
            <h4 className="text-sm font-medium text-[var(--foreground-secondary)] mb-3">
              {t("faqTitle")}
            </h4>

            {/* FAQ List */}
            <div className="space-y-2">
              {faqs.length === 0 ? (
                <div className="text-center py-8 text-[var(--foreground-secondary)]">
                  <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm">{t("loading")}</p>
                </div>
              ) : (
                faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-[var(--border)] rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-[var(--background)] transition-colors"
                    >
                      <span className="text-sm text-[var(--foreground)] font-medium pr-2">
                        {getQuestion(faq)}
                      </span>
                      {expandedId === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-[var(--foreground-secondary)] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--foreground-secondary)] shrink-0" />
                      )}
                    </button>
                    {expandedId === faq.id && (
                      <div className="px-3 pb-3 text-sm text-[var(--foreground-secondary)] border-t border-[var(--border)] pt-2 bg-[var(--background)]">
                        {getAnswer(faq)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Contact CTA */}
            {faqs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--foreground-secondary)] mb-2">
                  {t("noAnswer")}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-2 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t("contactUs")}
                </button>
              </div>
            )}
          </>
        ) : (
          <InquiryForm onBack={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}
