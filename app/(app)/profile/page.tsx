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

  const [user, gitHubProfile, streaks] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        image: true,
        followers: true,
      },
    }),
    prisma.gitHubProfile.findUnique({
      where: { userId },
    }),
    getContributionStreaks(userId),
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
    commits: gitHubProfile?.totalCommits ?? 0,
    pullRequests: gitHubProfile?.totalPRs ?? 0,
    stars: gitHubProfile?.totalStars ?? 0,
    followers: user.followers ?? 0,
    languages: topLanguages(languages),
    currentStreak: streaks.currentStreak,
    githubUrl,
    hasGitHubProfile: Boolean(gitHubProfile),
  }

  return <ExportProfilePage data={cardData} profileUrl={profileUrl} />
}
