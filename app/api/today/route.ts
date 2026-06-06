import { auth } from "@/lib/auth"
import {
  aggregateStats,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
} from "@/lib/aggregate-stats"
import { prisma } from "@/lib/db"
import { getUserIdFromSession } from "@/lib/session"

async function syncToday(userId: string) {
  const syncedEvents = await aggregateStats(userId)

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
    where: {
      userId,
      receivedAt: { gte: todayStart, lt: tomorrowStart },
    },
    orderBy: { receivedAt: "desc" },
    select: {
      eventType: true,
      receivedAt: true,
      payload: true,
    },
    take: 10,
  })

  return {
    todayStats,
    yesterdayStats,
    recentEvents,
    serializedHourlyActivity,
    syncedEvents,
    syncedAt: new Date().toISOString(),
  }
}

async function handleToday(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = getUserIdFromSession(session)
  if (!userId) {
    return Response.json({ error: "Invalid session" }, { status: 401 })
  }

  try {
    const payload = await syncToday(userId)
    return Response.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("[api/today] sync failed:", err)
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to sync today's activity",
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  return handleToday(req)
}

export async function POST(req: Request) {
  return handleToday(req)
}
