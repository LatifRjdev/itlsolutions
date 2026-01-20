import { Metadata } from "next";
import Image from "next/image";
import { Target, Heart, Zap } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ITL Solutions - our mission, values, and the journey that made us a trusted technology partner.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const timeline = [
    {
      year: "2015",
      title: t("timeline.founded"),
      description: t("timeline.foundedDesc"),
    },
    {
      year: "2018",
      title: t("timeline.firstClient"),
      description: t("timeline.firstClientDesc"),
    },
    {
      year: "2023",
      title: t("timeline.expansion"),
      description: t("timeline.expansionDesc"),
    },
    {
      year: "2025",
      title: t("timeline.mission"),
      description: t("timeline.missionDesc"),
    },
  ];

  const values = [
    {
      icon: Target,
      title: t("excellence"),
      description: t("excellenceDesc"),
    },
    {
      icon: Heart,
      title: t("clientFocus"),
      description: t("clientFocusDesc"),
    },
    {
      icon: Zap,
      title: t("innovation"),
      description: t("innovationDesc"),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
                {t("pageTitle")}
              </h1>
              <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-6">
                {t("heroText")}
              </p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                {t("missionText")}
              </p>
            </div>
            <div className="flex-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative h-[400px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80"
                  alt="Our team at work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {t("journeyTitle")}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              {t("journeySubtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[var(--primary)]/20 hidden md:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 text-center md:text-right">
                    {index % 2 === 0 && (
                      <div className="bg-[var(--surface)] p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[var(--foreground-secondary)]">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="size-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.year}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    {index % 2 !== 0 && (
                      <div className="bg-[var(--surface)] p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[var(--foreground-secondary)]">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {t("valuesTitle")}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              {t("valuesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-8 rounded-xl bg-[var(--background)]"
              >
                <div className="size-16 mx-auto mb-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--foreground-secondary)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              {t("ctaSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/contact" size="lg">
                {t("viewWork")}
              </Button>
              <Button href="/portfolio" variant="outline" size="lg">
                {t("viewWork")}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
