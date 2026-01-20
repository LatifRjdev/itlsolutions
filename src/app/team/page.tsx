import { Metadata } from "next";
import { Container } from "@/components/ui";
import { TeamMemberCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the talented professionals behind ITL Solutions. Our diverse team brings expertise in development, design, and technology leadership.",
};

export default async function TeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
              Meet Our Team
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              We&apos;re a diverse group of passionate technologists, designers,
              and strategists united by our love for creating exceptional
              digital experiences.
            </p>
          </div>
        </Container>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                bio={member.bio}
                image={member.image}
                linkedin={member.linkedin || undefined}
                github={member.github || undefined}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              Join Our Team
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for talented individuals who are
              passionate about technology and innovation. Check out our open
              positions.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold h-12 px-8 rounded-lg transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
