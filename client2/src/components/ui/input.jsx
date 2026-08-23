import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        [
          "flex h-11 w-full min-w-0",
          "rounded-lg border border-input",
          "bg-card px-3 py-2",
          "text-sm text-foreground",
          "shadow-sm shadow-slate-950/[0.02]",
          "placeholder:text-muted-foreground",
          "transition-all duration-200",
          "outline-none",

          "hover:border-border-strong",

          "focus:border-primary",
          "focus:ring-4 focus:ring-primary/10",

          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:bg-muted",
          "disabled:text-muted-foreground",
          "disabled:opacity-70",

          "aria-invalid:border-destructive",
          "aria-invalid:ring-4",
          "aria-invalid:ring-destructive/10",

          "file:mr-3",
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "file:font-medium",
          "file:text-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
