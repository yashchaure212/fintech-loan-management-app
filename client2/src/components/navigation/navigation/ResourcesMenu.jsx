function ResourcesMenu({
  resources,
  navigateToHash,
}) {
  return (
    <div className="border-border bg-background absolute top-[calc(100%+8px)] right-0 z-[100] w-72 rounded-lg border p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
      {resources.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() =>
              navigateToHash(item.hash)
            }
            className="hover:bg-muted flex w-full items-center gap-3 rounded-md p-3 text-left transition"
          >
            <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
              <Icon className="h-4 w-4" />
            </span>

            <span>
              <span className="text-foreground block text-sm font-semibold">
                {item.label}
              </span>

              <span className="text-muted-foreground mt-0.5 block text-xs">
                Explore LoanPro
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ResourcesMenu;