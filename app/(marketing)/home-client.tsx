"use client"

import { LandingPage } from "@/components/landing-page"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function HomeClient({
  demoProfileUsername,
}: {
  demoProfileUsername: string | null
}) {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.data) {
      router.push("/dashboard")
    }
  }, [session.data, router])

  if (session.isPending || session.data) return null

  return <LandingPage demoProfileUsername={demoProfileUsername} />
}
