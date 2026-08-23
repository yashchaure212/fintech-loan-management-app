import { LoaderCircle } from "lucide-react";

function FullPageLoader({ message = "Loading..." }) {
  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-muted/20 px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center">
        <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm">
          <LoaderCircle
            className="size-5 animate-spin text-primary"
            aria-hidden="true"
          />
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">{message}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Please wait a moment.
        </p>
      </div>
    </div>
  );
}

export default FullPageLoader;
