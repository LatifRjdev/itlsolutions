import { Metadata } from "next";
import {
  Check,
  ArrowRight,
  Cloud,
  Code,
  Shield,
  BarChart,
  Users,
  Settings,
  Database,
  Globe,
  Lock,
  Zap,
  Smartphone,
  Palette,
  Lightbulb,
  LucideIcon,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button, Container } from "@/components/ui";
import { prisma } from "@/lib/prisma";

// SEO Metadata for Services Page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRussian = locale === "ru";

  return {
    title: isRussian
      ? "IT Услуги - Разработка сайтов и приложений в Душанбе | ITL Solutions"
      : "IT Services - Web & App Development in Dushanbe | ITL Solutions",
    description: isRussian
      ? "Полный спектр IT услуг в Таджикистане: разработка сайтов, мобильные приложения, облачные решения, кибербезопасность и IT консалтинг в Душанбе."
      : "Comprehensive IT services in Tajikistan: web development, mobile apps, cloud solutions, cybersecurity, and IT consulting in Dushanbe.",
    keywords: isRussian
      ? [
          "разработка сайтов Душанбе",
          "веб-разработка Таджикистан",
          "мобильные приложения Душанбе",
          "облачные решения Таджикистан",
          "кибербезопасность Таджикистан",
          "IT консалтинг Душанбе",
        ]
      : [
          "web development Dushanbe",
          "mobile apps Tajikistan",
          "cloud solutions Dushanbe",
          "cybersecurity Tajikistan",
          "IT consulting Central Asia",
        ],
    openGraph: {
      title: isRussian
        ? "IT Услуги в Таджикистане | ITL Solutions"
        : "IT Services in Tajikistan | ITL Solutions",
      description: isRussian
        ? "Разработка сайтов, мобильных приложений и IT решений в Душанбе"
        : "Web development, mobile apps and IT solutions in Dushanbe",
      locale: isRussian ? "ru_RU" : "en_US",
    },
  };
}

const iconMap: Record<string, LucideIcon> = {
  Cloud,
  Code,
  Shield,
  BarChart,
  Users,
  Settings,
  Database,
  Globe,
  Lock,
  Zap,
  Smartphone,
  Palette,
  Lightbulb,
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tCommon = await getTranslations("common");

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </Container>
      </section>

      {/* Services Detail */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="space-y-20">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Code;
              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-12 items-center`}
                >
                  {/* Icon/Visual */}
                  <div className="flex-1 flex justify-center">
                    <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 flex items-center justify-center">
                      <Icon className="w-32 h-32 text-[var(--primary)]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <h2 className="text-3xl font-bold text-[var(--foreground)]">
                      {service.title}
                    </h2>
                    <p className="text-[var(--foreground-secondary)] text-lg leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-[var(--foreground)]">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button href="/contact" className="mt-4">
                      {tCommon("learnMore")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              Not sure which service you need?
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              Our team of experts can help you identify the best solutions for
              your business needs. Let&apos;s schedule a free consultation.
            </p>
            <Button href="/contact" size="lg">
              Schedule a Consultation
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
