import { prisma } from "@/lib/db"
import type { Prisma } from "@/generated/prisma/client"

type GithubEventRow = {
  userId: string
  eventType: string
  payload: Prisma.JsonValue
  receivedAt: Date
}

function dayStart(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function payloadRecord(payload: Prisma.JsonValue): Record<string, unknown> | null {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>
  }
  return null
}

async function applyEvent(event: GithubEventRow) {
  const payload = payloadRecord(event.payload)
  const date = dayStart(event.receivedAt)

  if (event.eventType === "push") {
    const commits = Array.isArray(payload?.commits) ? payload.commits.length : 0
    await prisma.dailyStats.upsert({
      where: { userId_date: { userId: event.userId, date } },
      update: { commits: { increment: commits } },
      create: {
        userId: event.userId,
        date,
        commits,
        pullRequests: 0,
        prs_merged: 0,
        issues: 0,
        reviews: 0,
      },
    })
    return
  }

  if (event.eventType === "pull_request" && payload?.action === "opened") {
    await prisma.dailyStats.upsert({
      where: { userId_date: { userId: event.userId, date } },
      update: { pullRequests: { increment: 1 } },
      create: {
        userId: event.userId,
        date,
        commits: 0,
        pullRequests: 1,
        prs_merged: 0,
        issues: 0,
        reviews: 0,
      },
    })
    return
  }

  if (
    event.eventType === "pull_request" &&
    payload?.action === "closed" &&
    (payload.pull_request as { merged?: boolean })?.merged
  ) {
    await prisma.dailyStats.upsert({
      where: { userId_date: { userId: event.userId, date } },
      update: { prs_merged: { increment: 1 } },
      create: {
        userId: event.userId,
        date,
        commits: 0,
        pullRequests: 0,
        prs_merged: 1,
        issues: 0,
        reviews: 0,
      },
    })
    return
  }

  if (event.eventType === "pull_request_review") {
    await prisma.dailyStats.upsert({
      where: { userId_date: { userId: event.userId, date } },
      update: { reviews: { increment: 1 } },
      create: {
        userId: event.userId,
        date,
        commits: 0,
        pullRequests: 0,
        reviews: 1,
        issues: 0,
        prs_merged: 0,
      },
    })
    return
  }

  if (event.eventType === "issues") {
    await prisma.dailyStats.upsert({
      where: { userId_date: { userId: event.userId, date } },
      update: { issues: { increment: 1 } },
      create: {
        userId: event.userId,
        date,
        commits: 0,
        pullRequests: 0,
        reviews: 0,
        issues: 1,
        prs_merged: 0,
      },
    })
  }
}

/** Process unprocessed webhook events into dailyStats. Optionally scoped to one user. */
export async function aggregateStats(userId?: string) {
  const events = await prisma.githubEvents.findMany({
    where: {
      processed: false,
      ...(userId ? { userId } : {}),
    },
    select: {
      id: true,
      userId: true,
      eventType: true,
      payload: true,
      receivedAt: true,
    },
  })

  for (const event of events) {
    await applyEvent(event)
  }

  if (events.length > 0) {
    await prisma.githubEvents.updateMany({
      where: { id: { in: events.map((e) => e.id) } },
      data: { processed: true },
    })
  }

  return events.length
}

export function startOfToday() {
  return dayStart(new Date())
}

export function startOfYesterday() {
  const d = startOfToday()
  d.setDate(d.getDate() - 1)
  return d
}

export function startOfTomorrow() {
  const d = startOfToday()
  d.setDate(d.getDate() + 1)
  return d
}
