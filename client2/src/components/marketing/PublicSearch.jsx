import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Command, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { searchItems, loanTone } from "./loanCatalog";

function PublicSearch({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => window.clearTimeout(timer);
    }

    setQuery("");
  }, [open]);

  useEffect(() => {
    const handleShortcut = (event) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        onOpenChange(!open);
      }

      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return searchItems.slice(0, 8);
    }

    return searchItems
      .filter((item) =>
        `${item.label} ${item.description} ${item.keywords}`
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 8);
  }, [query]);

  const close = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          fixed
          left-1/2
          top-[10vh]
          w-[calc(100%-24px)]
          max-w-[680px]
          -translate-x-1/2
          translate-y-0
          gap-0
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-background
          p-0
          text-foreground
          shadow-[0_24px_80px_rgba(15,23,42,0.22)]
        "
      >
        {/* HEADER */}

        <DialogHeader
          className="
            border-b
            border-border
            bg-background
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
                sm:h-10
                sm:w-10
                sm:rounded-xl
              "
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <DialogTitle className="text-sm font-semibold sm:text-base">
                Search LoanPro
              </DialogTitle>

              <DialogDescription className="mt-0.5 text-[11px] sm:mt-1 sm:text-xs">
                Find loans, EMI, eligibility and support information.
              </DialogDescription>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={close}
              aria-label="Close search"
              className="
                h-9
                w-9
                shrink-0
                rounded-lg
                text-muted-foreground
                hover:bg-muted
                hover:text-foreground
              "
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* SEARCH INPUT */}

          <div className="relative mt-3 sm:mt-4">
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search loans, EMI, eligibility..."
              className="
                h-11
                rounded-xl
                border-border
                bg-muted/30
                pl-9
                pr-12
                text-sm
                text-foreground
                placeholder:text-muted-foreground
                focus-visible:ring-2
                focus-visible:ring-primary/20
                sm:h-12
                sm:pl-10
                sm:pr-20
              "
              aria-label="Search LoanPro"
            />

            {/* Desktop shortcut only */}

            <span
              className="
                pointer-events-none
                absolute
                right-2.5
                top-1/2
                hidden
                -translate-y-1/2
                items-center
                gap-1
                rounded-md
                border
                border-border
                bg-background
                px-2
                py-1
                text-[10px]
                font-medium
                text-muted-foreground
                sm:inline-flex
              "
            >
              <Command className="h-3 w-3" />K
            </span>
          </div>
        </DialogHeader>

        {/* RESULTS */}

        <div
          className="
            max-h-[55vh]
            overflow-y-auto
            overscroll-contain
            bg-background
            p-2.5
            sm:max-h-[520px]
            sm:p-4
          "
        >
          {results.length ? (
            <div className="space-y-1">
              {results.map((item) => {
                const Icon = item.icon;
                const colors = loanTone[item.tone] || loanTone.blue;

                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={close}
                    className="
                      group
                      flex
                      min-w-0
                      items-center
                      gap-2.5
                      rounded-xl
                      border
                      border-transparent
                      p-2.5
                      transition-colors
                      hover:border-border
                      hover:bg-muted
                      sm:gap-3
                      sm:p-3
                    "
                  >
                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        sm:h-10
                        sm:w-10
                        sm:rounded-xl
                        ${colors.icon}
                      `}
                    >
                      {Icon ? (
                        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                      ) : (
                        <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {item.label}
                        </span>

                        <span
                          className="
                            hidden
                            shrink-0
                            rounded-full
                            bg-muted
                            px-2
                            py-0.5
                            text-[10px]
                            font-medium
                            text-muted-foreground
                            sm:inline-flex
                          "
                        >
                          {item.type}
                        </span>
                      </span>

                      <span
                        className="
                          mt-0.5
                          block
                          line-clamp-1
                          text-[11px]
                          leading-5
                          text-muted-foreground
                          sm:line-clamp-2
                          sm:text-xs
                        "
                      >
                        {item.description}
                      </span>
                    </span>

                    <ArrowRight
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-muted-foreground
                        transition-transform
                        group-hover:translate-x-0.5
                        group-hover:text-primary
                      "
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-border
                bg-muted/40
                px-4
                py-8
                text-center
                sm:px-5
                sm:py-10
              "
            >
              <p className="text-sm font-semibold">No matching results</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try “education”, “EMI”, “documents”, or “eligibility”.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            hidden
            border-t
            border-border
            bg-muted/40
            px-5
            py-3
            text-[11px]
            text-muted-foreground
            sm:block
            sm:px-6
          "
        >
          Tip: press{" "}
          <span className="font-semibold text-foreground">Ctrl K</span> or{" "}
          <span className="font-semibold text-foreground">⌘ K</span> anytime to
          open search.
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PublicSearch;
