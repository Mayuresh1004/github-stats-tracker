import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import {
  aggregateStats,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
} from "@/lib/aggregate-stats"

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userId = session.user.id

  // Sync pending webhooks into dailyStats so Today reflects current data
  await aggregateStats(userId)

  const todayStart = startOfToday()
  const tomorrowStart = startOfTomorrow()
  const yesterdayStart = startOfYesterday()

  const hourlyActivity = (await prisma.$queryRaw`
    SELECT 
        EXTRACT(HOUR FROM "receivedAt") as hour,
        COUNT(*)::int as count
    FROM "GithubEvents"
    WHERE "userId" = ${userId}
    AND "receivedAt" >= ${todayStart}
    AND "receivedAt" < ${tomorrowStart}
    GROUP BY EXTRACT(HOUR FROM "receivedAt")
    ORDER BY hour ASC
  `) as { hour: number; count: number }[]

  const serializedHourlyActivity = hourlyActivity.map((row) => ({
    hour: Number(row.hour),
    count: Number(row.count),
  }))

  const todayStats = await prisma.dailyStats.findFirst({
    where: {
      userId,
      date: { gte: todayStart, lt: tomorrowStart },
    },
    orderBy: { date: "desc" },
    select: {
      commits: true,
      pullRequests: true,
      reviews: true,
      issues: true,
      prs_merged: true,
    },
  })

  const yesterdayStats = await prisma.dailyStats.findFirst({
    where: {
      userId,
      date: { gte: yesterdayStart, lt: todayStart },
    },
    orderBy: { date: "desc" },
    select: {
      commits: true,
      pullRequests: true,
      reviews: true,
      issues: true,
      prs_merged: true,
    },
  })

  const recentEvents = await prisma.githubEvents.findMany({
    where: { userId },
    orderBy: { receivedAt: "desc" },
    select: {
      eventType: true,
      receivedAt: true,
      payload: true,
    },
    take: 10,
  })

  return Response.json({
    todayStats,
    yesterdayStats,
    recentEvents,
    serializedHourlyActivity,
  })
}
