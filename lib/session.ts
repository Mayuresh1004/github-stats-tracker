import type { auth } from "@/lib/auth"

type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>

export function getUserIdFromSession(session: AuthSession) {
  return session.user?.id ?? session.session?.userId
}
