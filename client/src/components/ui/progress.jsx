import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Progress({ className, value, ...props }) {
  const progressValue = Math.min(100, Math.max(0, value || 0));

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={progressValue}
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{
          width: `${progressValue}%`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
