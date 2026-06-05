import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
          {Icon && <Icon className="h-7 w-7 text-[var(--accent)]" />}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-secondary)] md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className={cn("shrink-0")}>{action}</div>}
    </div>
  )
}
