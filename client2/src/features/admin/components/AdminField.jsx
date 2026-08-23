function AdminField({ label, value, emphasize = false, className = "" }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value;

  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1.5 break-words leading-6",
          emphasize
            ? "text-base font-semibold tracking-tight text-foreground"
            : "text-sm font-medium text-foreground",
        ].join(" ")}
      >
        {displayValue}
      </p>
    </div>
  );
}

export default AdminField;
