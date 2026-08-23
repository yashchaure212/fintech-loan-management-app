import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          "flex min-h-28 w-full min-w-0 resize-y",
          "rounded-lg border border-input",
          "bg-card px-3 py-2.5",
          "text-sm text-foreground",
          "shadow-sm shadow-slate-950/[0.02]",
          "placeholder:text-muted-foreground",
          "transition-all duration-200",
          "outline-none",

          "hover:border-border-strong",

          "focus:border-primary",
          "focus:ring-4 focus:ring-primary/10",

          "disabled:cursor-not-allowed",
          "disabled:bg-muted",
          "disabled:text-muted-foreground",
          "disabled:opacity-70",

          "aria-invalid:border-destructive",
          "aria-invalid:ring-4",
          "aria-invalid:ring-destructive/10",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
