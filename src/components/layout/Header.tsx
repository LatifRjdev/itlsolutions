"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button, Container, Logo } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const navigation = [
    { name: t("services"), href: "/services" },
    { name: t("portfolio"), href: "/portfolio" },
    { name: t("about"), href: "/about" },
    { name: t("blog"), href: "/blog" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <Container>
        <div className="py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="text-lg font-bold leading-tight tracking-[-0.015em] text-[var(--foreground)]">
              Solutions
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button href="/contact" size="md">
              {t("getQuote")}
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="size-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button href="/contact" size="md" className="mt-2">
                {t("getQuote")}
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
