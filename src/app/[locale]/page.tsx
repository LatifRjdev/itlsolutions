import Image from "next/image";
import {
  Users,
  HeadphonesIcon,
  Rocket,
  DollarSign,
  Hexagon,
  Diamond,
  Triangle,
  Circle,
  Infinity,
  Cloud,
  Code,
  Shield,
  Smartphone,
  Database,
  Cpu,
  Globe,
  Palette,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button, Container } from "@/components/ui";
import { ServiceCard } from "@/components/cards";
import { stats, whyChooseUs } from "@/data/services";
import { prisma } from "@/lib/prisma";

const iconMap: Record<string, LucideIcon> = {
  Cloud,
  Code,
  Shield,
  Smartphone,
  Database,
  Cpu,
  Users,
  HeadphonesIcon,
  Rocket,
  DollarSign,
  Globe,
  Palette,
  Lightbulb,
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    take: 6,
  });
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full">
        <div
          className="w-full h-[600px] bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2069&q=80')`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-[960px] flex flex-col items-center text-center gap-6">
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                {t("heroTitle")}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <Button href="/services" size="lg">
                  {t("cta")}
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg">
                  {t("viewAll")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-[var(--surface)] border-b border-[var(--border)] py-8">
        <Container size="lg">
          <p className="text-center text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-widest mb-6">
            Trusted by innovative companies
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--foreground-secondary)]">
              <Hexagon className="w-8 h-8" /> TechCorp
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--foreground-secondary)]">
              <Diamond className="w-8 h-8" /> Vertex
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--foreground-secondary)]">
              <Triangle className="w-8 h-8" /> Pyramid
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--foreground-secondary)]">
              <Circle className="w-8 h-8" /> Orbit
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--foreground-secondary)]">
              <Infinity className="w-8 h-8" /> Infinity
            </div>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-[var(--foreground)] text-3xl md:text-4xl font-bold mb-4">
              {t("servicesTitle")}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              {t("servicesSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Cloud;
              return (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  icon={IconComponent}
                  title={service.title}
                  description={service.description}
                />
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="lg">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[var(--primary)] font-bold tracking-wider text-sm uppercase">
                  {t("whyChooseUs")}
                </span>
                <h2 className="text-3xl md:text-4xl font-black mt-2 text-[var(--foreground)] leading-tight">
                  {t("whyChooseUsSubtitle")}
                </h2>
                <p className="text-[var(--foreground-secondary)] mt-4">
                  We don&apos;t just write code; we solve business problems. Our
                  agile approach ensures transparency, speed, and quality in
                  every deliverable.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Users, ...whyChooseUs[0] },
                  { icon: HeadphonesIcon, ...whyChooseUs[1] },
                  { icon: Rocket, ...whyChooseUs[2] },
                  { icon: DollarSign, ...whyChooseUs[3] },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 size-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[var(--primary)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--foreground)]">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[var(--foreground-secondary)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="rounded-xl overflow-hidden shadow-2xl relative h-[400px] w-full bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80"
                  alt="Team collaborating on a project"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--primary)] text-white">
        <Container size="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium opacity-90 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="bg-gradient-to-r from-[var(--primary)] to-blue-600 rounded-2xl p-10 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("readyToStart")}
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                {t("readyToStartSubtitle")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button href="/contact" variant="secondary" size="lg">
                  {t("contactUs")}
                </Button>
                <Button
                  href="/portfolio"
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[var(--primary)]"
                >
                  {t("viewAll")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
