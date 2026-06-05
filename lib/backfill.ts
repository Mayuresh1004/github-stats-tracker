import { prisma } from "@/lib/db"

const GITHUB_STATS_QUERY = `query GitHubStats($username: String!) {
  user(login: $username) {
    login
    name
    avatarUrl
    bio
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        name
        stargazerCount
        forkCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
            }
          }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    pullRequests(first: 100) {
      totalCount
    }
    issues(first: 100) {
      totalCount
    }
  }
}`

type GitHubRepoNode = {
  forkCount: number
  stargazerCount: number
  languages: {
    edges: { size: number; node: { name: string } }[]
  }
}

type GitHubStatsResponse = {
  data?: {
    user?: {
      repositories: { totalCount: number; nodes: GitHubRepoNode[] }
      contributionsCollection: {
        totalCommitContributions: number
        contributionCalendar: {
          weeks: {
            contributionDays: { contributionCount: number; date: string }[]
          }[]
        }
      }
      pullRequests: { totalCount: number }
      issues: { totalCount: number }
    }
  }
  errors?: { message: string }[]
}

export class BackfillError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "BackfillError"
  }
}

export async function backfillUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, access_token: true },
  })

  if (!user?.username) {
    throw new BackfillError("User has no GitHub username")
  }

  let accessToken = user.access_token
  if (!accessToken) {
    const account = await prisma.account.findFirst({
      where: { userId },
      select: { accessToken: true },
    })
    accessToken = account?.accessToken ?? null
  }

  if (!accessToken) {
    throw new BackfillError("No GitHub access token for user")
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: GITHUB_STATS_QUERY,
      variables: { username: user.username },
    }),
  })

  const data = (await response.json()) as GitHubStatsResponse

  if (!response.ok || data.errors?.length) {
    throw new BackfillError(
      data.errors?.[0]?.message ?? `GitHub API error (${response.status})`
    )
  }

  const ghUser = data.data?.user
  if (!ghUser) {
    throw new BackfillError("GitHub user not found")
  }

  const weeks = ghUser.contributionsCollection.contributionCalendar.weeks

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      await prisma.contributionHistory.upsert({
        where: {
          userId_date: {
            userId,
            date: new Date(day.date),
          },
        },
        update: { contributionCount: day.contributionCount },
        create: {
          userId,
          date: new Date(day.date),
          contributionCount: day.contributionCount,
        },
      })
    }
  }

  const languageMap: Record<string, number> = {}
  for (const repo of ghUser.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name
      languageMap[name] = (languageMap[name] ?? 0) + edge.size
    }
  }

  const totalForks = ghUser.repositories.nodes.reduce(
    (acc, repo) => acc + repo.forkCount,
    0
  )
  const totalStars = ghUser.repositories.nodes.reduce(
    (acc, repo) => acc + repo.stargazerCount,
    0
  )

  await prisma.gitHubProfile.upsert({
    where: { userId },
    update: {
      languages: languageMap,
      totalRepos: ghUser.repositories.totalCount,
      totalForks,
      totalStars,
      totalCommits: ghUser.contributionsCollection.totalCommitContributions,
      totalPRs: ghUser.pullRequests.totalCount,
      totalIssues: ghUser.issues.totalCount,
    },
    create: {
      userId,
      languages: languageMap,
      totalRepos: ghUser.repositories.totalCount,
      totalForks,
      totalStars,
      totalCommits: ghUser.contributionsCollection.totalCommitContributions,
      totalPRs: ghUser.pullRequests.totalCount,
      totalIssues: ghUser.issues.totalCount,
    },
  })

  return { userId, username: user.username }
}

export async function backfillAllUsers() {
  const users = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { id: true, username: true },
  })

  const results: { userId: string; username: string | null; ok: boolean; error?: string }[] =
    []

  for (const user of users) {
    try {
      await backfillUser(user.id)
      results.push({ userId: user.id, username: user.username, ok: true })
    } catch (err) {
      results.push({
        userId: user.id,
        username: user.username,
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  return results
}

export async function scheduleBackfillForNewUser(userId: string) {
  const existing = await prisma.gitHubProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (existing) return

  void backfillUser(userId).catch((err) => {
    console.error(`[backfill] signup backfill failed for ${userId}:`, err)
  })
}
