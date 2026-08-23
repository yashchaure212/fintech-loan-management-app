import { Input } from "@/components/ui/input";
import FormField from "@/components/common/FormField";

function FormInput({
  label,
  error,
  helperText,
  required = false,
  className = "",
  id,
  ...props
}) {
  const inputId = id ?? props.name;

  const errorMessage = typeof error === "string" ? error : error?.message;

  const errorId = inputId ? `${inputId}-error` : undefined;
  const helperId = inputId ? `${inputId}-helper` : undefined;

  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      error={errorMessage}
      helperText={helperText}
      required={required}
      className={className}
    >
      <Input
        {...props}
        id={inputId}
        aria-invalid={errorMessage ? "true" : undefined}
        aria-required={required ? "true" : undefined}
        aria-describedby={describedBy}
      />
    </FormField>
  );
}

export default FormInput;
