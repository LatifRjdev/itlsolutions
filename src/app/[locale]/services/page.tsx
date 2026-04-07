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
import { Button, Container, Breadcrumbs } from "@/components/ui";
import { FAQSchema } from "@/components/seo/FAQSchema";
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
  const isRussian = locale === "ru";

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  const faqs = isRussian
    ? [
        { question: "Сколько стоит разработка сайта в Таджикистане?", answer: "Стоимость зависит от сложности проекта. Простой лендинг — от $500, корпоративный сайт — от $1500, интернет-магазин — от $3000. Свяжитесь с нами для точной оценки вашего проекта." },
        { question: "Сколько времени занимает разработка сайта?", answer: "Лендинг — 1-2 недели, корпоративный сайт — 3-6 недель, сложное веб-приложение — 2-4 месяца. Сроки обсуждаются индивидуально." },
        { question: "Какие технологии вы используете?", answer: "Мы используем React, Next.js, TypeScript для фронтенда, Node.js, PostgreSQL для бэкенда, React Native для мобильных приложений, AWS и Azure для облачных решений." },
        { question: "Вы работаете только в Душанбе?", answer: "Наш офис находится в Душанбе, но мы работаем с клиентами по всему Таджикистану, СНГ и за рубежом. Возможна удалённая работа." },
        { question: "Предоставляете ли вы поддержку после запуска?", answer: "Да, мы предоставляем техническую поддержку и обслуживание после запуска проекта. Доступны различные планы поддержки." },
        { question: "Можете ли вы помочь с продвижением сайта?", answer: "Да, мы предлагаем SEO-оптимизацию, настройку аналитики и консультации по цифровому маркетингу для продвижения вашего бизнеса в интернете." },
      ]
    : [
        { question: "How much does website development cost in Tajikistan?", answer: "Cost depends on project complexity. A simple landing page starts from $500, corporate website from $1500, e-commerce from $3000. Contact us for an accurate estimate for your project." },
        { question: "How long does it take to develop a website?", answer: "A landing page takes 1-2 weeks, corporate website 3-6 weeks, complex web application 2-4 months. Timelines are discussed individually." },
        { question: "What technologies do you use?", answer: "We use React, Next.js, TypeScript for frontend, Node.js, PostgreSQL for backend, React Native for mobile apps, AWS and Azure for cloud solutions." },
        { question: "Do you only work in Dushanbe?", answer: "Our office is in Dushanbe, but we work with clients across Tajikistan, CIS countries, and internationally. Remote collaboration is available." },
        { question: "Do you provide support after launch?", answer: "Yes, we provide technical support and maintenance after project launch. Various support plans are available." },
        { question: "Can you help with website promotion?", answer: "Yes, we offer SEO optimization, analytics setup, and digital marketing consulting to promote your business online." },
      ];

  return (
    <>
      {/* FAQ Schema for SEO */}
      <FAQSchema faqs={faqs} />

      {/* Breadcrumbs */}
      <section className="bg-[var(--background)]">
        <Container size="lg">
          <Breadcrumbs
            locale={locale}
            items={[{ label: t("title"), href: "/services" }]}
          />
        </Container>
      </section>

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

      {/* FAQ Section */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="md">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {isRussian ? "Часто задаваемые вопросы" : "Frequently Asked Questions"}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              {isRussian
                ? "Ответы на популярные вопросы о наших IT-услугах"
                : "Answers to common questions about our IT services"}
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 text-[var(--foreground)] font-medium hover:bg-[var(--primary)]/5 transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex-shrink-0 text-[var(--primary)] group-open:rotate-45 transition-transform text-xl font-light">+</span>
                </summary>
                <div className="px-5 pb-5 text-[var(--foreground-secondary)] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {isRussian ? "Не уверены, какая услуга вам нужна?" : "Not sure which service you need?"}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              {isRussian
                ? "Наша команда экспертов поможет подобрать лучшие решения для вашего бизнеса. Запишитесь на бесплатную консультацию."
                : "Our team of experts can help you identify the best solutions for your business needs. Let's schedule a free consultation."}
            </p>
            <Button href="/contact" size="lg">
              {isRussian ? "Записаться на консультацию" : "Schedule a Consultation"}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
