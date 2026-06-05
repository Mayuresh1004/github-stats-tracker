import { Flame, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const variants = {
  current: {
    label: "Current Streak",
    emoji: "🔥",
    Icon: Flame,
    iconClass: "text-[var(--green)]",
  },
  longest: {
    label: "Longest Streak",
    emoji: "⚡",
    Icon: Zap,
    iconClass: "text-[var(--accent)]",
  },
} as const

export function StreakCard({
  variant,
  days,
  subtitle,
}: {
  variant: keyof typeof variants
  days: number
  subtitle?: string
}) {
  const { label, emoji, Icon, iconClass } = variants[variant]

  return (
    <div className="card-surface flex items-center justify-between p-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {label} {emoji}
        </p>
        <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
          {days} {days === 1 ? "day" : "days"}
        </p>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </div>
      <Icon className={cn("h-12 w-12 opacity-40", iconClass)} strokeWidth={1.25} />
    </div>
  )
}
