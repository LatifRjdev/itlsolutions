import Link from "next/link";
import { Hexagon, Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Container } from "@/components/ui";

const footerLinks = {
  services: [
    { name: "Cloud Solutions", href: "/services#cloud" },
    { name: "Custom Software", href: "/services#software" },
    { name: "IT Consulting", href: "/services#consulting" },
    { name: "Cybersecurity", href: "/services#security" },
    { name: "Data Analytics", href: "/services#analytics" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "GitHub", icon: Github, href: "https://github.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export function Footer() {
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
              Transforming businesses through cutting-edge technology solutions.
              From cloud infrastructure to custom software development.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@itlsolutions.net"
                className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@itlsolutions.net
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)]">
                <MapPin className="w-4 h-4" />
                123 Tech Park, Silicon Valley, CA
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
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
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
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
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
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
            © {new Date().getFullYear()} ITL Solutions. All rights reserved.
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
