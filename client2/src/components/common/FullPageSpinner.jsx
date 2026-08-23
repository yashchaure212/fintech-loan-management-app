function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-6">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="relative flex size-12 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-border" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <div className="size-2 rounded-full bg-primary" />
        </div>

        {/* Message */}
        <div className="mt-5 text-center">
          <p className="text-sm font-semibold text-foreground">
            Loading LoanPro
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Please wait while we prepare your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FullPageSpinner;
