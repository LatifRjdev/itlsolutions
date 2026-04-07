import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itlsolutions.net";
  const isDefault = locale === "en";
  const prefix = isDefault ? "" : `/${locale}`;

  const allItems = [
    { label: locale === "ru" ? "Главная" : "Home", href: `${prefix}/` },
    ...items.map((item) => ({
      ...item,
      href: `${prefix}${item.href}`,
    })),
  ];

  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: `${siteUrl}${item.href}`,
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex items-center gap-1 text-sm text-[var(--foreground-secondary)]">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index === 0 && (
                  <Home className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                )}
                {isLast ? (
                  <span className="text-[var(--foreground)] font-medium truncate">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="hover:text-[var(--primary)] transition-colors truncate"
                    >
                      {item.label}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
