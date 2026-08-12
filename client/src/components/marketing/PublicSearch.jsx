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
      }, 80);

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
        className="
          max-w-2xl
          gap-0
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-background
          p-0
          text-foreground
          shadow-[0_30px_90px_rgba(15,23,42,0.25)]
          opacity-100
        "
        showCloseButton={false}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <DialogHeader className="border-b border-border bg-background px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <Search className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold">
                Search LoanPro
              </DialogTitle>

              <DialogDescription className="mt-1">
                Find a loan, calculator, guide, or support information.
              </DialogDescription>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={close}
              aria-label="Close search"
              className="
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

          {/* ===================================================
              SEARCH INPUT
          ==================================================== */}

          <div className="relative mt-4">
            <Search
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                h-4 w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search loans, EMI, eligibility, documents..."
              className="
                h-12
                rounded-xl
                border-border
                bg-background
                pl-10
                pr-20
                text-foreground
                placeholder:text-muted-foreground
                focus-visible:ring-2
                focus-visible:ring-primary/20
              "
              aria-label="Search LoanPro"
            />

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
                bg-muted
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

        {/* =====================================================
            SEARCH RESULTS
        ====================================================== */}

        <div
          className="
            max-h-[min(62vh,520px)]
            overflow-y-auto
            bg-background
            p-3
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
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-transparent
                      bg-background
                      p-3
                      transition-all
                      duration-150
                      hover:border-border
                      hover:bg-muted
                    "
                  >
                    <span
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${colors.icon}
                      `}
                    >
                      {Icon ? (
                        <Icon className="h-[18px] w-[18px]" />
                      ) : (
                        <Search className="h-[18px] w-[18px]" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {item.label}
                        </span>

                        <span
                          className="
                            hidden
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
                          line-clamp-2
                          text-xs
                          leading-5
                          text-muted-foreground
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
                        duration-200
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
                bg-muted
                px-5
                py-10
                text-center
              "
            >
              <p className="text-sm font-semibold">No matching results</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try “education”, “EMI”, “documents”, or “eligibility”.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          className="
            border-t
            border-border
            bg-muted
            px-5
            py-3
            text-[11px]
            text-muted-foreground
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
