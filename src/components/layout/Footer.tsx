"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Hexagon, Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Container } from "@/components/ui";

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "GitHub", icon: Github, href: "https://github.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export function Footer() {
  const t = useTranslations("footer");

  const footerLinks = {
    services: [
      { name: t("cloudSolutions"), href: "/services#cloud" },
      { name: t("customSoftware"), href: "/services#software" },
      { name: t("itConsulting"), href: "/services#consulting" },
      { name: t("cybersecurity"), href: "/services#security" },
      { name: t("dataAnalytics"), href: "/services#analytics" },
    ],
    company: [
      { name: t("aboutUs"), href: "/about" },
      { name: t("portfolio"), href: "/portfolio" },
      { name: t("blog"), href: "/blog" },
      { name: t("contact"), href: "/contact" },
    ],
    legal: [
      { name: t("privacy"), href: "/privacy" },
      { name: t("terms"), href: "/terms" },
      { name: t("cookies"), href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-[var(--background-alt)] border-t border-[var(--border)] pt-16 pb-8">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="size-8 text-[var(--primary)]">
                <Hexagon className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                ITL Solutions
              </h2>
            </Link>
            <p className="text-sm text-[var(--foreground-secondary)] mb-6 max-w-sm">
              {t("description")}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@itlsolutions.net"
                className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@itlsolutions.net
              </a>
              <a
                href="tel:+992557777509"
                className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +992 557 777 509
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)]">
                <MapPin className="w-4 h-4" />
                Ayni 50/51, Dushanbe, Tajikistan
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">
              {t("services")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">
              {t("company")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            © {new Date().getFullYear()} {t("copyright")}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
