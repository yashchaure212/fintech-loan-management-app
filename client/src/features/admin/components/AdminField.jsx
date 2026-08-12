function AdminField({ label, value, emphasize = false }) {
  return (
    <div className="min-w-0">
      <p className="financial-label">{label}</p>
      <p
        className={[
          "mt-1 break-words",
          emphasize
            ? "financial-value"
            : "text-sm font-medium text-foreground",
        ].join(" ")}
      >
        {value ?? "-"}
      </p>
    </div>
  );
}

export default AdminField;
