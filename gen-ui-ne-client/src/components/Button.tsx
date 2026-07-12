import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const variants = cva(
  "group focus-visible:ring-ring inline-flex transform items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 focus-visible:ring-1 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary-foreground bg-primary hover:bg-primary/80",
        secondary:
          "text-secondary-foreground bg-secondary hover:bg-secondary/90",
        outline:
          "border-input hover:text-accent-foreground hover:bg-accent bg-background border",
        link: "text-primary underline underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-6",
        xs: "h-7 gap-1 px-3",
        sm: "h-9 gap-1 px-4",
        lg: "h-11 gap-1.5 px-8",
      },
    },
    defaultVariants: {},
  },
);

interface Interface
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  variant?: "default" | "secondary" | "outline" | "link";
  size?: "default" | "xs" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, Interface>(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(variants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
