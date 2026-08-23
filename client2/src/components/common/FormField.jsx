import { Children, cloneElement, isValidElement } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function mergeDescribedBy(...ids) {
  const merged = ids
    .flatMap((value) => String(value || "").split(/\s+/))
    .filter(Boolean);

  return [...new Set(merged)].join(" ") || undefined;
}

function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required = false,
  className,
  children,
}) {
  const child =
    isValidElement(children) && Children.count(children) === 1
      ? children
      : null;

  const controlId = htmlFor ?? child?.props?.id ?? child?.props?.name;

  const errorId = controlId ? `${controlId}-error` : undefined;

  const helperId = controlId ? `${controlId}-helper` : undefined;

  const describedBy = mergeDescribedBy(
    child?.props?.["aria-describedby"],
    error ? errorId : null,
    helperText ? helperId : null,
  );

  const control = child
    ? cloneElement(child, {
        id: child.props.id ?? controlId,

        "aria-invalid": error
          ? "true"
          : (child.props["aria-invalid"] ?? undefined),

        "aria-required": required
          ? "true"
          : (child.props["aria-required"] ?? undefined),

        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div
      className={cn("group space-y-2", className)}
      data-disabled={child?.props?.disabled ? "true" : undefined}
    >
      {label ? (
        <Label
          htmlFor={controlId}
          className="text-sm font-medium text-foreground"
        >
          {label}

          {required ? (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      {control}

      {helperText ? (
        <p id={helperId} className={cn("text-helper", error && "sr-only")}>
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          className="text-sm font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
