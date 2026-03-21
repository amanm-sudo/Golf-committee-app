import { HTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "low" | "lowest";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      lowest: "bg-surface-container-lowest",
      default: "bg-surface-container",
      low: "bg-surface-container-low",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-all hover:shadow-xl hover:shadow-primary/5",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
