import { clsx } from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6",
        hover &&
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[var(--primary)]",
        className
      )}
    >
      {children}
    </div>
  );
}
