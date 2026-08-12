import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required = false,
  className,
  children,
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      {children}

      {helperText && !error ? (
        <p id={helperId} className="text-helper">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
