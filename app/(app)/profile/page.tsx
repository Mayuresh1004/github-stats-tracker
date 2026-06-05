import { ExportProfilePage } from "@/components/profile/export-profile-page"
import type { GitHubExportCardData } from "@/components/profile/github-export-card"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getContributionStreaks } from "@/lib/streaks"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

function topLanguages(languages: Record<string, number> | null | undefined): string[] {
  if (!languages) return []
  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name]) => name)
}

export default async function ProfileExportPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/")
  }

  const userId = session.session.userId

  const [user, gitHubProfile, streaks, reviewSum] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        image: true,
        followers: true,
        following: true,
      },
    }),
    prisma.gitHubProfile.findUnique({
      where: { userId },
    }),
    getContributionStreaks(userId),
    prisma.dailyStats.aggregate({
      where: { userId },
      _sum: { reviews: true },
    }),
  ])

  if (!user?.username) {
    redirect("/dashboard")
  }

  const baseUrl =
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"

  const profileUrl = `${baseUrl.replace(/\/$/, "")}/u/${user.username}`
  const githubUrl = `github.com/${user.username}`

  const languages = gitHubProfile?.languages as Record<string, number> | null

  const cardData: GitHubExportCardData = {
    name: user.name ?? user.username,
    username: user.username,
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? user.image ?? "",
    stats: {
      commits: gitHubProfile?.totalCommits ?? 0,
      prs: gitHubProfile?.totalPRs ?? 0,
      issues: gitHubProfile?.totalIssues ?? 0,
      stars: gitHubProfile?.totalStars ?? 0,
      forks: gitHubProfile?.totalForks ?? 0,
      repos: gitHubProfile?.totalRepos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      reviews: reviewSum._sum.reviews ?? 0,
      streak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
    },
    languages: topLanguages(languages),
    currentStreak: streaks.currentStreak,
    githubUrl,
    hasGitHubProfile: Boolean(gitHubProfile),
  }

  return <ExportProfilePage data={cardData} profileUrl={profileUrl} />
}
