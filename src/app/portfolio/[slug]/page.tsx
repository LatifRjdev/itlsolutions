import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Container, Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { slug: true },
  });
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = await prisma.project.findMany({
    where: {
      category: project.category,
      NOT: { slug: project.slug },
    },
    take: 2,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <span className="inline-block bg-[var(--primary)] text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
                {project.title}
              </h1>
              <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <Button href="/contact" size="lg">
                Start a Similar Project
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-video">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Project Details */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              Project Overview
            </h2>
            <div className="text-[var(--foreground-secondary)] mb-6 whitespace-pre-wrap">
              {project.content}
            </div>

            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 mt-8">
              Key Features
            </h3>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">•</span>
                Responsive design optimized for all devices
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">•</span>
                Scalable architecture for future growth
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">•</span>
                Integration with existing systems and workflows
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)]">•</span>
                Comprehensive testing and quality assurance
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 mt-8">
              Results
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] text-center">
                <div className="text-3xl font-black text-[var(--primary)] mb-2">
                  40%
                </div>
                <div className="text-sm text-[var(--foreground-secondary)]">
                  Increase in Efficiency
                </div>
              </div>
              <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] text-center">
                <div className="text-3xl font-black text-[var(--primary)] mb-2">
                  2x
                </div>
                <div className="text-sm text-[var(--foreground-secondary)]">
                  User Engagement
                </div>
              </div>
              <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] text-center">
                <div className="text-3xl font-black text-[var(--primary)] mb-2">
                  99.9%
                </div>
                <div className="text-sm text-[var(--foreground-secondary)]">
                  Uptime Achieved
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-[var(--surface)]">
          <Container size="lg">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((related) => (
                <Link
                  key={related.slug}
                  href={`/portfolio/${related.slug}`}
                  className="group block bg-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)] hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-[var(--foreground-secondary)] mt-2">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
