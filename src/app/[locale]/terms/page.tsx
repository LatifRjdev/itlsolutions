import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for ITL Solutions",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="py-20 bg-[var(--background)]">
      <Container size="md">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-8">
          {t("termsTitle")}
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--foreground-secondary)]">
          <p className="text-sm text-[var(--foreground-secondary)] mb-8">
            {t("lastUpdated")}: January 2025
          </p>

          <h2 className="text-2xl font-semibold text-[var(--foreground)] mt-8 mb-4">
            {t("terms.section1Title")}
          </h2>
          <p>{t("terms.section1Text")}</p>

          <h2 className="text-2xl font-semibold text-[var(--foreground)] mt-8 mb-4">
            {t("terms.section2Title")}
          </h2>
          <p>{t("terms.section2Text")}</p>

          <h2 className="text-2xl font-semibold text-[var(--foreground)] mt-8 mb-4">
            {t("terms.section3Title")}
          </h2>
          <p>{t("terms.section3Text")}</p>

          <h2 className="text-2xl font-semibold text-[var(--foreground)] mt-8 mb-4">
            {t("terms.section4Title")}
          </h2>
          <p>{t("terms.section4Text")}</p>

          <h2 className="text-2xl font-semibold text-[var(--foreground)] mt-8 mb-4">
            {t("terms.section5Title")}
          </h2>
          <p>
            {t("terms.section5Text")} <a href="mailto:info@itlsolutions.net" className="text-[var(--primary)]">info@itlsolutions.net</a>
          </p>
        </div>
      </Container>
    </section>
  );
}
