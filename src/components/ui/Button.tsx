import { clsx } from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-lg hover:shadow-xl",
  secondary:
    "bg-white hover:bg-gray-100 text-[#111418] shadow-lg hover:shadow-xl",
  outline:
    "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
  ghost: "text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const styles = clsx(
    "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
