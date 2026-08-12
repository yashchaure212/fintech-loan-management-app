import StatusBadge from "@/components/common/StatusBadge";

function StatusTimeline({ history }) {
  if (!history?.length) {
    return (
      <section className="space-y-4 border-t pt-6">
        <h2 className="subsection-title">Status timeline</h2>
        <p className="text-helper">No status history recorded yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 border-t pt-6">
      <h2 className="subsection-title">Status timeline</h2>

      <ol className="space-y-4">
        {history.map((item) => (
          <li
            key={item.id}
            className="relative border-l-2 border-border pl-4 sm:pl-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} type="loan" />
              <time
                className="text-caption text-muted-foreground"
                dateTime={item.createdAt}
              >
                {new Date(item.createdAt).toLocaleString("en-IN")}
              </time>
            </div>

            {item.remarks ? (
              <p className="mt-2 text-sm text-foreground">{item.remarks}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default StatusTimeline;
