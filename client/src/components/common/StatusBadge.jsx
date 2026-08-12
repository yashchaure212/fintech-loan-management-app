import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/lib/status";
import { cn } from "@/lib/utils";

function StatusBadge({ status, type, className }) {
  const config = getStatusConfig(status, type);

  return (
    <Badge
      variant={config.tone}
      className={cn("status-badge", className)}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
