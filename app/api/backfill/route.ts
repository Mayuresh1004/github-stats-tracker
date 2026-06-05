import { auth } from "@/lib/auth"
import { backfillUser, BackfillError } from "@/lib/backfill"

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await backfillUser(session.user.id)
    return Response.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof BackfillError ? err.message : "Backfill failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
