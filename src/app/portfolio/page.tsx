import { Metadata } from "next";
import { Container } from "@/components/ui";
import { PortfolioCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore our portfolio of successful projects across fintech, healthcare, e-commerce, and more.",
};

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
              Our Portfolio
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              Discover how we&apos;ve helped businesses across various industries
              achieve their digital transformation goals.
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
              Have a project in mind?
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help bring your vision to life with our
              expertise and innovative solutions.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold h-12 px-8 rounded-lg transition-colors"
            >
              Start Your Project
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
