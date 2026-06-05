import { ContributionHeatmap } from "@/components/contribution-heatmap"
import { MarketingHeader } from "@/components/marketing-header"
import { MetricCard } from "@/components/metric-card"
import { ProfileHeader } from "@/components/ProfileHeader"
import { StreakCard } from "@/components/streak-card"
import { TopLanguages } from "@/components/top-languages"
import { prisma } from "@/lib/db"
import { getContributionStreaks } from "@/lib/streaks"
import {
  FolderGit2,
  Star,
  GitCommit,
  GitPullRequest,
  CircleDot,
} from "lucide-react"

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const user = await prisma.user.findFirst({
    where: { username },
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <MarketingHeader showSignIn />
        <p className="px-8 py-16 text-center text-lg text-[var(--text-secondary)]">
          User not found
        </p>
      </div>
    )
  }

  const [gitHubProfile, streaks, contributionSum] = await Promise.all([
    prisma.gitHubProfile.findUnique({
      where: { userId: user.id },
    }),
    getContributionStreaks(user.id),
    prisma.contributionHistory.aggregate({
      where: { userId: user.id },
      _sum: { contributionCount: true },
    }),
  ])

  const languages = gitHubProfile?.languages as Record<string, number> | null
  const totalContributions = contributionSum._sum.contributionCount ?? 0

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <MarketingHeader showSignIn />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <ProfileHeader
          username={user.username || ""}
          name={user.name ?? user.email ?? ""}
          avatarUrl={user.avatarUrl ?? user.image ?? ""}
          bio={user.bio || ""}
          publicRepos={gitHubProfile?.totalRepos ?? user.publicRepos ?? 0}
          followers={user.followers || 0}
          following={user.following || 0}
        />

        {gitHubProfile ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard
              label="Public Repos"
              value={gitHubProfile.totalRepos}
              icon={FolderGit2}
            />
            <MetricCard
              label="Total Commits"
              value={gitHubProfile.totalCommits}
              icon={GitCommit}
            />
            <MetricCard
              label="Stars"
              value={gitHubProfile.totalStars}
              icon={Star}
            />
            <MetricCard
              label="Pull Requests"
              value={gitHubProfile.totalPRs}
              icon={GitPullRequest}
            />
            <MetricCard
              label="Issues"
              value={gitHubProfile.totalIssues}
              icon={CircleDot}
            />
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
            GitHub profile stats haven&apos;t been synced yet. They appear after
            the user signs in or when the weekly backfill runs.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContributionHeatmap
              username={user.username ?? ""}
              title={
                totalContributions > 0
                  ? `${totalContributions.toLocaleString()} contributions in the last year`
                  : undefined
              }
            />
          </div>
          <TopLanguages languages={languages} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <StreakCard variant="current" days={streaks.currentStreak} />
          <StreakCard variant="longest" days={streaks.longestStreak} />
        </div>
      </main>
    </div>
  )
}
