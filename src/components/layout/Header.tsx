"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Hexagon } from "lucide-react";
import { Button } from "@/components/ui";
import { Container } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <Container>
        <div className="py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 text-[var(--primary)]">
              <Hexagon className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[var(--foreground)]">
              ITL Solutions
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
            <Button href="/contact" size="md">
              Get a Quote
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
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
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button href="/contact" size="md" className="mt-2">
                Get a Quote
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
