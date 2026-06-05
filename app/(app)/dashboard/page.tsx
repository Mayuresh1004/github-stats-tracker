import ContributionChart from "@/components/ContributionChart"
import { ContributionHeatmap } from "@/components/contribution-heatmap"
import { MetricCard } from "@/components/metric-card"
import { PageHeader } from "@/components/page-header"
import { StreakCard } from "@/components/streak-card"
import { TopLanguages } from "@/components/top-languages"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getContributionStreaks } from "@/lib/streaks"
import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  Star,
  FolderGit2,
} from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/")
  }

  const userId = session.session.userId

  const [user, gitHubProfile, streaks, contributionHistory, contributionSum] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      }),
      prisma.gitHubProfile.findUnique({
        where: { userId },
      }),
      getContributionStreaks(userId),
      prisma.contributionHistory.findMany({
        where: { userId },
        select: { date: true, contributionCount: true },
        orderBy: { date: "asc" },
      }),
      prisma.contributionHistory.aggregate({
        where: { userId },
        _sum: { contributionCount: true },
      }),
    ])

  const languages = gitHubProfile?.languages as Record<string, number> | null
  const totalContributions = contributionSum._sum.contributionCount ?? 0
  const heatmapTitle =
    totalContributions > 0
      ? `${totalContributions.toLocaleString()} contributions in the last year`
      : "Contribution Activity"

  const chartData = contributionHistory.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    commits: row.contributionCount,
    pullRequests: 0,
    issues: 0,
  }))

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview synced from GitHub via backfill."
      />

      {gitHubProfile ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          <MetricCard
            label="Commits (1y)"
            value={gitHubProfile.totalCommits}
            icon={GitCommit}
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
          <MetricCard
            label="Stars"
            value={gitHubProfile.totalStars}
            icon={Star}
          />
          <MetricCard
            label="Public Repos"
            value={gitHubProfile.totalRepos}
            icon={FolderGit2}
          />
        </div>
      ) : (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
          GitHub profile stats will appear after sign-up backfill or the weekly
          sync runs.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <ContributionHeatmap
            username={user?.username ?? ""}
            title={heatmapTitle}
          />
        </div>
        <TopLanguages languages={languages} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StreakCard variant="current" days={streaks.currentStreak} />
        <StreakCard variant="longest" days={streaks.longestStreak} />
      </div>

      <div className="mt-6">
        <ContributionChart
          data={chartData}
          title="Contributions Over Time"
          variant="contributions"
        />
      </div>
    </>
  )
}
