import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: number;
  publishedAt: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  image,
  readTime,
  publishedAt,
}: BlogCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[var(--primary)] text-xs font-semibold uppercase tracking-wider">
            {category}
          </span>
          <span className="text-[var(--foreground-secondary)] text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> {readTime} min read
          </span>
        </div>
        <Link href={`/blog/${slug}`}>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-[var(--foreground-secondary)] text-sm mb-4 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--foreground-secondary)]">
            {formattedDate}
          </span>
          <Link
            href={`/blog/${slug}`}
            className="text-[var(--primary)] text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Read Article <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
