"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({ ...props }) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ className, ...props }) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1.5 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ ...props }) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({ className, size = "default", children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      type="button"
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        [
          "flex w-full min-w-0 items-center justify-between gap-2",
          "rounded-lg border border-input",
          "bg-card px-3",
          "text-sm text-foreground",
          "shadow-sm shadow-slate-950/[0.02]",
          "transition-all duration-200",
          "outline-none",

          "hover:border-border-strong",

          "focus:border-primary",
          "focus:ring-4 focus:ring-primary/10",

          "disabled:cursor-not-allowed",
          "disabled:opacity-60",

          "data-placeholder:text-muted-foreground",

          "aria-invalid:border-destructive",
          "aria-invalid:ring-4",
          "aria-invalid:ring-destructive/10",

          "data-[size=default]:h-11",
          "data-[size=sm]:h-9",

          "[&>span]:line-clamp-1",
          "[&>span]:flex",
          "[&>span]:items-center",
          "[&>span]:gap-2",

          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          [
            "relative z-50",
            "max-h-[var(--radix-select-content-available-height)]",
            "min-w-[8rem]",
            "overflow-x-hidden overflow-y-auto",
            "rounded-md",
            "border border-border",
            "bg-popover text-popover-foreground",
            "p-1.5",
            "shadow-lg",
            "origin-[var(--radix-select-content-transform-origin)]",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0",
            "data-[state=closed]:zoom-out-95",

            position === "popper" && "data-[side=bottom]:translate-y-1",
            position === "popper" && "data-[side=left]:-translate-x-1",
            position === "popper" && "data-[side=right]:translate-x-1",
            position === "popper" && "data-[side=top]:-translate-y-1",
          ]
            .filter(Boolean)
            .join(" "),
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectPrimitive.Viewport
          data-slot="select-viewport"
          className={cn(
            "p-0.5",
            position === "popper" &&
              "w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        [
          "relative flex w-full cursor-default",
          "items-center gap-2",
          "rounded-lg py-2 pl-2 pr-8",
          "text-sm text-foreground",
          "outline-none select-none",

          "focus:bg-primary-soft",
          "focus:text-primary",
          "data-[highlighted]:bg-primary-soft",
          "data-[highlighted]:text-primary",

          "data-[disabled]:pointer-events-none",
          "data-[disabled]:opacity-50",

          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
