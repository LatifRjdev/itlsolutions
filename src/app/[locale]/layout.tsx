import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ITLSolutionsSchema } from "@/components/seo/JsonLd";
import { locales, defaultLocale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate alternates for hreflang
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itlsolutions.net";

  // Build language alternates for hreflang tags
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = loc === defaultLocale ? siteUrl : `${siteUrl}/${loc}`;
  }
  languages["x-default"] = siteUrl;

  return {
    alternates: {
      canonical: locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        {/* JSON-LD Structured Data for SEO */}
        <ITLSolutionsSchema locale={locale} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
