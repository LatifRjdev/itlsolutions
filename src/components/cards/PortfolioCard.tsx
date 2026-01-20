import Image from "next/image";
import Link from "next/link";

interface PortfolioCardProps {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
}

export function PortfolioCard({
  slug,
  title,
  category,
  description,
  image,
  technologies,
}: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${slug}`}
      className="group block bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[var(--primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
          {title}
        </h3>
        <p className="text-[var(--foreground-secondary)] text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs bg-[var(--background)] text-[var(--foreground-secondary)] px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
