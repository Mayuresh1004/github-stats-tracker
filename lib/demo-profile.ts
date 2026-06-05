import { prisma } from "@/lib/db"

/**
 * Username for the landing page "View Demo Profile" link.
 * Set DEMO_PROFILE_USERNAME in .env to pin a specific public profile.
 */
export async function getDemoProfileUsername(): Promise<string | null> {
  const fromEnv = process.env.DEMO_PROFILE_USERNAME?.trim()
  if (fromEnv) {
    const user = await prisma.user.findFirst({
      where: { username: fromEnv },
      select: { username: true },
    })
    return user?.username ?? null
  }

  const withStats = await prisma.user.findFirst({
    where: {
      username: { not: null },
      dailyStats: { some: {} },
    },
    orderBy: {
      dailyStats: { _count: "desc" },
    },
    select: { username: true },
  })

  if (withStats?.username) {
    return withStats.username
  }

  const anyUser = await prisma.user.findFirst({
    where: { username: { not: null } },
    select: { username: true },
  })

  return anyUser?.username ?? null
}
