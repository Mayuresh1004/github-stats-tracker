import { backfillAllUsers } from "@/lib/backfill"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const results = await backfillAllUsers()
  const succeeded = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok)

  return Response.json({
    success: true,
    total: results.length,
    succeeded,
    failed: failed.length,
    errors: failed.length > 0 ? failed : undefined,
  })
}
