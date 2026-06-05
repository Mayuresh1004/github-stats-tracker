"use client"

import { SyncNowButton } from "@/components/sync-now-button"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function DashboardSyncButton() {
  const router = useRouter()

  const handleSync = useCallback(async () => {
    const res = await fetch("/api/backfill", { method: "POST" })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(
        typeof body.error === "string" ? body.error : "Backfill failed"
      )
    }
    router.refresh()
  }, [router])

  return <SyncNowButton onSync={handleSync} />
}
