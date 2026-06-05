"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"

export function SyncNowButton({
  onSync,
  label = "Sync now",
}: {
  onSync: () => Promise<void>
  label?: string
}) {
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSync() {
    setSyncing(true)
    setError(null)
    try {
      await onSync()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={syncing}
        className="border-[var(--border)] bg-[var(--surface)]"
      >
        <RefreshCw className={syncing ? "animate-spin" : ""} />
        {syncing ? "Syncing…" : label}
      </Button>
      {error && (
        <p className="max-w-[220px] text-right text-xs text-[var(--orange)]">
          {error}
        </p>
      )}
    </div>
  )
}
