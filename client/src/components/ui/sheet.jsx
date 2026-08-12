import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[2px]",
        "data-open:animate-in data-open:fade-in-0",
        "data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />

      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col border-border bg-card text-sm text-card-foreground shadow-[var(--shadow-lg)]",
          "transition duration-200 ease-out",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:border-t",
          "data-[side=bottom]:max-h-[90vh]",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:border-b",
          "data-[side=left]:sm:max-w-md",
          "data-[side=right]:sm:max-w-md",
          "data-open:animate-in data-open:fade-in-0",
          "data-[side=right]:data-open:slide-in-from-right-4",
          "data-[side=left]:data-open:slide-in-from-left-4",
          "data-[side=top]:data-open:slide-in-from-top-4",
          "data-[side=bottom]:data-open:slide-in-from-bottom-4",
          "data-closed:animate-out data-closed:fade-out-0",
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            asChild
            className="absolute right-4 top-4"
          >
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-1.5 border-b border-border px-6 py-5",
        className,
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-3 border-t border-border bg-muted/30 px-6 py-5",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
