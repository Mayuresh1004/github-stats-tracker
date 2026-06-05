import { aggregateStats } from "@/lib/aggregate-stats"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const processed = await aggregateStats()

  return Response.json({ success: true, processed })
}
