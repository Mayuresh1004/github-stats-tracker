"use client"

import {
  GitHubExportCard,
  type GitHubExportCardData,
} from "@/components/profile/github-export-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CARD_STAT_OPTIONS,
  DEFAULT_CARD_STATS,
  normalizeCardStats,
  storageKeyForCardStats,
  type CardStatId,
} from "@/lib/profile-card-stats"
import { CARD_STYLES, type CardStyleId } from "@/lib/profile-card-styles"
import { cn } from "@/lib/utils"
import { toPng } from "html-to-image"
import {
  Copy,
  Check,
  Share2,
  Download,
  FileText,
  Code2,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

export function ExportProfilePage({
  data,
  profileUrl,
}: {
  data: GitHubExportCardData
  profileUrl: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [styleId, setStyleId] = useState<CardStyleId>("ocean")
  const [selectedStats, setSelectedStats] =
    useState<CardStatId[]>(DEFAULT_CARD_STATS)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKeyForCardStats(data.username))
      if (saved) {
        setSelectedStats(normalizeCardStats(JSON.parse(saved)))
      }
    } catch {
      setSelectedStats(DEFAULT_CARD_STATS)
    }
  }, [data.username])

  useEffect(() => {
    if (selectedStats.length !== 4) return
    localStorage.setItem(
      storageKeyForCardStats(data.username),
      JSON.stringify(selectedStats)
    )
  }, [data.username, selectedStats])

  const toggleStat = useCallback((id: CardStatId) => {
    setSelectedStats((prev) => {
      if (prev.includes(id)) return prev
      return [...prev.slice(1), id]
    })
  }, [])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&bgcolor=161b22&color=e6edf3`

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }, [profileUrl])

  const shareNative = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${data.name} on GitMaxxing`,
        text: `Check out my GitHub stats`,
        url: profileUrl,
      })
    } else {
      await copyLink()
    }
  }, [copyLink, data.name, profileUrl])

  const exportPng = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0d1117",
      })
      const link = document.createElement("a")
      link.download = `gitmaxxing-${data.username}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }, [data.username])

  const exportPdf = useCallback(() => {
    window.print()
  }, [])

  const embedHtml = `<a href="${profileUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;font-family:system-ui,sans-serif;text-decoration:none;color:#60a5fa;">
  View ${data.name}'s GitHub stats on GitMaxxing →
</a>`

  const copyEmbed = useCallback(async () => {
    await navigator.clipboard.writeText(embedHtml)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }, [embedHtml])

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`My GitHub developer card on GitMaxxing`)}&url=${encodeURIComponent(profileUrl)}`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`

  return (
    <div className="print:hidden">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Export GitHub Card
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)] md:text-base">
            Preview and share your GitHub identity as a professional card
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink} className="border-[var(--border)]">
            {copiedLink ? (
              <Check className="mr-1.5 h-4 w-4" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            Copy Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareNative}
            className="border-[var(--border)]"
          >
            <Share2 className="mr-1.5 h-4 w-4" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={exportPng}
            disabled={exporting}
            className="bg-white font-semibold text-black hover:bg-white/90"
          >
            <Download className="mr-1.5 h-4 w-4" />
            {exporting ? "Exporting…" : "Export PNG"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-medium text-[var(--text-secondary)]">
              Card Preview
            </h2>
            <GitHubExportCard
              ref={cardRef}
              data={data}
              styleId={styleId}
              selectedStats={selectedStats}
              className="export-print-target max-w-2xl"
            />
            {!data.hasGitHubProfile && (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                GitHub stats will populate after your profile syncs (sign-up
                backfill or weekly cron).
              </p>
            )}
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              <Link
                href={profileUrl}
                target="_blank"
                className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
              >
                View public profile
                <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Stat Cards
            </h2>
            <p className="mb-3 text-xs text-[var(--text-secondary)]">
              Choose 4 stats to show on your card. Tap another stat to swap it in.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {CARD_STAT_OPTIONS.map(({ id, label, icon: Icon }) => {
                const selected = selectedStats.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleStat(id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)] ring-1 ring-[var(--accent)]/40"
                        : "border-[var(--border)] bg-[#161b22] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                    aria-pressed={selected}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Card Style
            </h2>
            <div className="flex flex-wrap gap-3">
              {CARD_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setStyleId(style.id)}
                  className={cn(
                    "h-12 w-12 rounded-xl ring-2 ring-offset-2 ring-offset-[#121212] transition-all",
                    style.dot,
                    styleId === style.id ? style.ring : "ring-transparent opacity-60 hover:opacity-100"
                  )}
                  title={style.label}
                  aria-label={`${style.label} card style`}
                  aria-pressed={styleId === style.id}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-5">
            <h3 className="font-semibold text-[var(--text-primary)]">QR Code</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Scan to view profile
            </p>
            <div className="mt-4 flex justify-center rounded-lg bg-[#0d1117] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Profile QR code"
                width={160}
                height={160}
                className="rounded-md"
              />
            </div>
          </div>

          <div className="card-surface p-5">
            <h3 className="font-semibold text-[var(--text-primary)]">Profile Link</h3>
            <div className="relative mt-3">
              <Input
                readOnly
                value={profileUrl}
                className="border-[var(--border)] bg-[#0d1117] pr-10 text-xs text-[var(--text-secondary)]"
              />
              <button
                type="button"
                onClick={copyLink}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
                aria-label="Copy profile link"
              >
                {copiedLink ? (
                  <Check className="h-4 w-4 text-[var(--green)]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Share to
            </p>
            <div className="mt-2 flex gap-2">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[#0d1117] px-3 py-2 text-center text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
              >
                Twitter
              </a>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[#0d1117] px-3 py-2 text-center text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="card-surface p-5">
            <h3 className="font-semibold text-[var(--text-primary)]">Export</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Download your card in multiple formats
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={exportPng}
                disabled={exporting}
                className="w-full justify-center bg-white font-semibold text-black hover:bg-white/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as PNG
              </Button>
              <Button
                variant="outline"
                onClick={exportPdf}
                className="w-full justify-center border-[var(--border)] bg-[#0d1117]"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button
                variant="outline"
                onClick={copyEmbed}
                className="w-full justify-center border-[var(--border)] bg-[#0d1117]"
              >
                {copiedEmbed ? (
                  <Check className="mr-2 h-4 w-4 text-[var(--green)]" />
                ) : (
                  <Code2 className="mr-2 h-4 w-4" />
                )}
                {copiedEmbed ? "Copied!" : "Embed HTML"}
              </Button>
            </div>
          </div>
        </aside>
      </div>

    </div>
  )
}
