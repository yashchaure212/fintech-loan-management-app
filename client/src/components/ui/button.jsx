import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "rounded-xl border border-transparent",
    "text-sm font-medium whitespace-nowrap",
    "transition-colors duration-200",
    "outline-none select-none",
    "focus-visible:border-ring",
    "focus-visible:ring-4 focus-visible:ring-ring/15",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-4 aria-invalid:ring-destructive/15",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary-hover hover:shadow-brand",

        outline:
          "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary-soft hover:text-primary",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground",

        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",

        link: "text-primary underline-offset-4 hover:underline",

        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90",

        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
      },

      size: {
        default: "h-11 min-h-11 gap-2 px-4",

        xs: "h-8 min-h-8 gap-1.5 px-2.5 text-xs",

        sm: "h-10 min-h-10 gap-1.5 px-3",

        lg: "h-11 min-h-11 gap-2 px-5",

        xl: "h-12 min-h-12 gap-2.5 px-6 text-base",

        icon: "size-11 min-h-11 min-w-11",

        "icon-xs": "size-8 min-h-8 min-w-8",

        "icon-sm": "size-10 min-h-10 min-w-10",

        "icon-lg": "size-11 min-h-11 min-w-11",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
