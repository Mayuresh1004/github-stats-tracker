import type { LucideIcon } from "lucide-react"
import {
  CircleDot,
  Flame,
  FolderGit2,
  GitCommit,
  GitFork,
  GitPullRequest,
  MessageSquare,
  Star,
  UserPlus,
  Users,
  Zap,
} from "lucide-react"

export const CARD_STAT_IDS = [
  "commits",
  "prs",
  "issues",
  "stars",
  "forks",
  "repos",
  "followers",
  "following",
  "reviews",
  "streak",
  "longestStreak",
] as const

export type CardStatId = (typeof CARD_STAT_IDS)[number]

export const DEFAULT_CARD_STATS: CardStatId[] = [
  "commits",
  "prs",
  "stars",
  "followers",
]

export type GitHubExportCardStats = Record<CardStatId, number>

export const CARD_STAT_OPTIONS: {
  id: CardStatId
  label: string
  shortLabel: string
  icon: LucideIcon
}[] = [
  { id: "commits", label: "Commits", shortLabel: "Commits", icon: GitCommit },
  { id: "prs", label: "Pull Requests", shortLabel: "PRs", icon: GitPullRequest },
  { id: "issues", label: "Issues", shortLabel: "Issues", icon: CircleDot },
  { id: "stars", label: "Stars", shortLabel: "Stars", icon: Star },
  { id: "forks", label: "Forks", shortLabel: "Forks", icon: GitFork },
  { id: "repos", label: "Public Repos", shortLabel: "Repos", icon: FolderGit2 },
  { id: "followers", label: "Followers", shortLabel: "Followers", icon: Users },
  { id: "following", label: "Following", shortLabel: "Following", icon: UserPlus },
  { id: "reviews", label: "Reviews", shortLabel: "Reviews", icon: MessageSquare },
  { id: "streak", label: "Current Streak", shortLabel: "Streak", icon: Flame },
  {
    id: "longestStreak",
    label: "Longest Streak",
    shortLabel: "Best Streak",
    icon: Zap,
  },
]

export function isCardStatId(value: unknown): value is CardStatId {
  return (
    typeof value === "string" &&
    CARD_STAT_IDS.includes(value as CardStatId)
  )
}

export function normalizeCardStats(value: unknown): CardStatId[] {
  if (!Array.isArray(value)) return DEFAULT_CARD_STATS

  const unique = value.filter(isCardStatId).filter(
    (id, index, arr) => arr.indexOf(id) === index
  )

  if (unique.length !== 4) return DEFAULT_CARD_STATS
  return unique
}

export function storageKeyForCardStats(username: string) {
  return `gitmaxxing-export-stats-${username}`
}
