import { prisma } from "./db"

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0]
}

export async function getUserStreaks(userId: string) {
    const stats = await prisma.dailyStats.findMany({
        where: { 
            userId,
        },
        orderBy: { date: "desc" }
    });
    
    let currentStreak = 0;
    let longestStreak = 0;
    let currentDate = new Date().toISOString().split('T')[0]

    for (const stat of stats) {
        if (stat.commits > 0 || stat.pullRequests > 0 || stat.issues > 0) {
            if (currentDate === stat.date.toISOString().split('T')[0]) {
                const prev = new Date(currentDate)
                prev.setDate(prev.getDate() - 1)
                currentDate = prev.toISOString().split('T')[0]
                currentStreak++;
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
                break;
            }
        }
    }

    return { currentStreak, longestStreak };
}

/** Streaks from GitHub contribution history (backfill), not webhook dailyStats. */
export async function getContributionStreaks(userId: string) {
  const rows = await prisma.contributionHistory.findMany({
    where: { userId, contributionCount: { gt: 0 } },
    select: { date: true },
    orderBy: { date: "asc" },
  })

  const activeDates = rows.map((r) => toDateKey(r.date))
  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const activeSet = new Set(activeDates)

  let currentStreak = 0
  const cursor = new Date()
  if (!activeSet.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (activeSet.has(toDateKey(cursor))) {
    currentStreak++
    cursor.setDate(cursor.getDate() - 1)
  }

  let longestStreak = 0
  let run = 0
  for (let i = 0; i < activeDates.length; i++) {
    if (i === 0) {
      run = 1
    } else {
      const prev = new Date(activeDates[i - 1])
      const curr = new Date(activeDates[i])
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / 86_400_000
      )
      run = diffDays === 1 ? run + 1 : 1
    }
    longestStreak = Math.max(longestStreak, run)
  }

  return { currentStreak, longestStreak }
}
