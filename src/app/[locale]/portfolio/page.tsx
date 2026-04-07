import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Breadcrumbs } from "@/components/ui";
import { PortfolioCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRussian = locale === "ru";

  return {
    title: isRussian
      ? "Портфолио - Наши проекты | ITL Solutions"
      : "Portfolio - Our Projects | ITL Solutions",
    description: isRussian
      ? "Портфолио ITL Solutions: успешные проекты в финтехе, электронной коммерции, здравоохранении и других отраслях. Веб-разработка и мобильные приложения в Душанбе."
      : "ITL Solutions portfolio: successful projects in fintech, e-commerce, healthcare and more. Web development and mobile apps in Dushanbe.",
    keywords: isRussian
      ? ["портфолио ITL Solutions", "проекты веб-разработки Душанбе", "кейсы IT компании Таджикистан"]
      : ["ITL Solutions portfolio", "web development projects Dushanbe", "IT company cases Tajikistan"],
    openGraph: {
      title: isRussian
        ? "Портфолио | ITL Solutions"
        : "Portfolio | ITL Solutions",
      description: isRussian
        ? "Наши успешные проекты в Таджикистане и за рубежом"
        : "Our successful projects in Tajikistan and abroad",
      locale: isRussian ? "ru_RU" : "en_US",
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const isRussian = locale === "ru";

  const projects = await prisma.project.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-[var(--background)]">
        <Container size="lg">
          <Breadcrumbs
            locale={locale}
            items={[{ label: t("title"), href: "/portfolio" }]}
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

      {/* Portfolio Grid */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <PortfolioCard
                key={project.id}
                slug={project.slug}
                title={project.title}
                category={project.category}
                description={project.description}
                image={project.image}
                technologies={project.technologies}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {isRussian ? "Есть идея для проекта?" : "Have a project in mind?"}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              {isRussian
                ? "Давайте обсудим, как мы можем воплотить вашу идею в жизнь с помощью наших решений и экспертизы."
                : "Let's discuss how we can help bring your vision to life with our expertise and innovative solutions."}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold h-12 px-8 rounded-lg transition-colors"
            >
              {isRussian ? "Начать проект" : "Start Your Project"}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
