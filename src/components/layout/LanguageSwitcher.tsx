"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, '') || '/';
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4 text-[var(--foreground-secondary)]" />
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          locale === 'en'
            ? 'text-[var(--primary)] bg-[var(--primary)]/10'
            : 'text-[var(--foreground-secondary)] hover:text-[var(--primary)]'
        }`}
      >
        EN
      </button>
      <span className="text-[var(--foreground-secondary)]">/</span>
      <button
        onClick={() => switchLocale('ru')}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          locale === 'ru'
            ? 'text-[var(--primary)] bg-[var(--primary)]/10'
            : 'text-[var(--foreground-secondary)] hover:text-[var(--primary)]'
        }`}
      >
        RU
      </button>
    </div>
  );
}
