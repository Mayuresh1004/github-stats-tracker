import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { text: string; positive?: boolean }
  className?: string
}) {
  return (
    <div className={cn("card-surface p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-[var(--accent)] opacity-80" />
        )}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--text-primary)]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs",
            trend.positive === true && "text-[var(--green)]",
            trend.positive === false && "text-[var(--orange)]",
            trend.positive === undefined && "text-[var(--text-muted)]"
          )}
        >
          {trend.text}
        </p>
      )}
    </div>
  )
}
