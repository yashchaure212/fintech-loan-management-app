import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

function AuthInput({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />

      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}

export default AuthInput;
