"use client"

import { Link2 } from "lucide-react"
import { useState } from "react"

export const ShareButton = ({ username }: { username: string }) => {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${username}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
    >
      <Link2 className="h-4 w-4" />
      {copied ? "Copied!" : "Share Profile"}
    </button>
  )
}
