"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border text-sm font-medium shadow-[0_10px_30px_rgba(8,17,31,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[linear-gradient(135deg,var(--foreground),var(--accent-strong))] px-5 py-3 text-white hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,123,255,0.28)] dark:bg-[linear-gradient(135deg,#eef5ff,#ffffff)] dark:text-[var(--background)] dark:hover:bg-[linear-gradient(135deg,#ffffff,#dbe9ff)]",
        secondary:
          "border-[var(--card-border)] bg-[var(--card-strong)] px-5 py-3 text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[rgba(15,123,255,0.28)] hover:bg-[var(--muted-soft)] hover:text-[var(--foreground)]",
        ghost:
          "border-transparent bg-transparent px-4 py-2 text-[var(--muted)] shadow-none hover:bg-[var(--muted-soft)] hover:text-[var(--foreground)]",
      },
      size: {
        default: "",
        sm: "px-3 py-2 text-xs",
        lg: "px-6 py-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";
