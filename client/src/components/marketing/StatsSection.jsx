const stats = [
  {
    value: "Digital",
    label: "Application journey",
  },
  {
    value: "Online",
    label: "Document submission",
  },
  {
    value: "1 account",
    label: "Loan tracking",
  },
  {
    value: "24/7",
    label: "Application visibility",
  },
];

function StatsSection() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={[
              "px-4 py-6 sm:px-6 sm:py-7",
              index !== 0 ? "border-l border-border" : "",
            ].join(" ")}
          >
            <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
