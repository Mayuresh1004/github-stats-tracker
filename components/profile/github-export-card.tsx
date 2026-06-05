"use client"

import { formatCompact } from "@/lib/format-stats"
import { GitBranch } from "lucide-react"
import { CARD_STYLES, type CardStyleId } from "@/lib/profile-card-styles"
import {
  CARD_STAT_OPTIONS,
  DEFAULT_CARD_STATS,
  type CardStatId,
  type GitHubExportCardStats,
} from "@/lib/profile-card-stats"
import { cn } from "@/lib/utils"
import { Flame } from "lucide-react"
import { forwardRef, useMemo } from "react"

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#e3b341",
  Python: "#58a6ff",
  Go: "#00add8",
  Rust: "#f78166",
  Java: "#ffa657",
  Ruby: "#f778ba",
}

export type GitHubExportCardData = {
  name: string
  username: string
  bio: string
  avatarUrl: string
  stats: GitHubExportCardStats
  languages: string[]
  currentStreak: number
  githubUrl: string
  hasGitHubProfile: boolean
}

function formatStatValue(id: CardStatId, value: number) {
  if (id === "streak" || id === "longestStreak") {
    return value.toLocaleString()
  }
  return formatCompact(value)
}

export const GitHubExportCard = forwardRef<
  HTMLDivElement,
  {
    data: GitHubExportCardData
    styleId: CardStyleId
    selectedStats?: CardStatId[]
    className?: string
  }
>(function GitHubExportCard(
  { data, styleId, selectedStats = DEFAULT_CARD_STATS, className },
  ref
) {
  const style = CARD_STYLES.find((s) => s.id === styleId) ?? CARD_STYLES[0]

  const stats = useMemo(
    () =>
      selectedStats.map((id) => {
        const option = CARD_STAT_OPTIONS.find((item) => item.id === id)!
        return {
          id,
          label: option.shortLabel,
          value: formatStatValue(id, data.stats[id]),
          icon: option.icon,
        }
      }),
    [data.stats, selectedStats]
  )

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0d1117] p-6 shadow-2xl",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br opacity-80 blur-2xl",
          style.glow
        )}
      />

      <div className="relative">
        <div className="flex items-start gap-4">
          <img
            src={data.avatarUrl || "/placeholder-avatar.png"}
            alt=""
            className="h-16 w-16 rounded-full border-2 border-[var(--border)] object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{data.name}</h2>
              <span className="rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-foreground)]">
                Pro
              </span>
            </div>
            <p className="text-sm text-[var(--accent)]">@{data.username}</p>
            {data.bio && (
              <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">
                {data.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ id, label, value, icon: Icon }) => (
            <div
              key={id}
              className="rounded-xl border border-[var(--border)] bg-[#161b22]/80 px-3 py-3"
            >
              <Icon className="mb-2 h-4 w-4 text-[var(--text-muted)]" />
              <p className="text-lg font-bold tabular-nums text-white">{value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {data.languages.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Top Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[#161b22] px-3 py-1 text-xs text-[var(--text-primary)]"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: LANGUAGE_COLORS[lang] ?? "#8b949e",
                    }}
                  />
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent)]">
            <GitBranch className="h-4 w-4" strokeWidth={2.5} />
            GitMaxxing
          </span>
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            {data.currentStreak > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--green)]">
                <Flame className="h-3.5 w-3.5" />
                {data.currentStreak} day streak
              </span>
            )}
            <span className="text-[var(--text-muted)]">{data.githubUrl}</span>
          </div>
        </div>
      </div>
    </div>
  )
})
