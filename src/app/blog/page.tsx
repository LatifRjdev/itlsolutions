import { Metadata } from "next";
import { Container } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stay updated with the latest trends in technology, software development, and digital transformation.",
};

export default async function BlogPage() {
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
              Our Blog
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              Insights, tutorials, and thought leadership from our team of
              technology experts.
            </p>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                image={post.image}
                readTime={post.readTime}
                publishedAt={post.publishedAt?.toISOString() || new Date().toISOString()}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              Get the latest articles and insights delivered directly to your
              inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
