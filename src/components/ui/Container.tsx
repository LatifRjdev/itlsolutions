import { clsx } from "clsx";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
  sm: "max-w-[768px]",
  md: "max-w-[960px]",
  lg: "max-w-[1200px]",
  xl: "max-w-[1440px]",
};

export function Container({
  children,
  className,
  size = "xl",
}: ContainerProps) {
  return (
    <div
      className={clsx("mx-auto px-4 md:px-10", sizeStyles[size], className)}
    >
      {children}
    </div>
  );
}
