import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ServiceCard({
  id,
  icon: Icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="group bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--primary)]/50 transition-all duration-300 flex flex-col gap-4">
      <div className="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
      <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
        {description}
      </p>
      <Link
        href={`/services#${id}`}
        className="text-[var(--primary)] font-semibold text-sm mt-auto inline-flex items-center gap-1 group-hover:gap-2 transition-all"
      >
        Learn more <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
