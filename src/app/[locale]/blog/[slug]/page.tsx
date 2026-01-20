import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2, Linkedin, Twitter } from "lucide-react";
import { Container } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Get related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      published: true,
      NOT: { slug: post.slug },
    },
    take: 3,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 bg-[var(--background)]">
        <Container size="md">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-[var(--primary)] text-sm font-semibold uppercase tracking-wider">
              {post.category}
            </span>
            {formattedDate && (
              <span className="text-[var(--foreground-secondary)] text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
            )}
            <span className="text-[var(--foreground-secondary)] text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--foreground)] mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl relative aspect-video mb-12">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[var(--background)]">
        <Container size="md">
          <article className="prose prose-lg max-w-none">
            <div className="text-[var(--foreground-secondary)] text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mt-10">
              <p className="text-[var(--foreground)] font-medium mb-4">
                Need help implementing these strategies?
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                Our team of experts is ready to help you navigate your digital transformation journey.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold h-10 px-6 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </article>

          {/* Share Section */}
          <div className="flex items-center gap-4 mt-12 pt-8 border-t border-[var(--border)]">
            <span className="text-[var(--foreground)] font-medium flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share this article:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://itlsolutions.net/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </Container>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-[var(--surface)]">
          <Container size="lg">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.slug}
                  slug={relatedPost.slug}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt}
                  category={relatedPost.category}
                  image={relatedPost.image}
                  readTime={relatedPost.readTime}
                  publishedAt={relatedPost.publishedAt?.toISOString() || ""}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
