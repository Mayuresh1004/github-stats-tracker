"use client"

import { MetricCard } from "@/components/metric-card"
import { PageHeader } from "@/components/page-header"
import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  Eye,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type TodayPayload = {
  todayStats: {
    commits: number
    pullRequests: number
    issues: number
    reviews: number
  } | null
  yesterdayStats: {
    commits: number
    pullRequests: number
    issues: number
    reviews: number
  } | null
  serializedHourlyActivity: { hour: number; count: number }[]
  recentEvents: {
    eventType: string
    receivedAt: string
    payload: unknown
  }[]
}

function trend(
  today: number,
  yesterday: number
): { text: string; positive?: boolean } {
  const diff = today - yesterday
  if (diff > 0) return { text: `+${diff} vs yesterday`, positive: true }
  if (diff < 0) return { text: `${diff} vs yesterday`, positive: false }
  return { text: "— same as yesterday" }
}

function timeAgo(iso: string) {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return `${Math.floor(sec / 3600)}h ago`
}

const EVENT_COLORS: Record<string, string> = {
  push: "#3fb950",
  pull_request: "#58a6ff",
  pull_request_review: "#e3b341",
  issues: "#f78166",
}

function eventLabel(type: string, payload: unknown) {
  const p = payload as Record<string, unknown> | null
  const repo =
    (p?.repository as { full_name?: string })?.full_name ??
    (p?.repo as { name?: string })?.name ??
    "repository"
  switch (type) {
    case "push":
      return { title: `Pushed commits to ${repo}`, sub: "Push event" }
    case "pull_request":
      return { title: `Pull request activity on ${repo}`, sub: "PR event" }
    case "issues":
      return { title: `Issue activity on ${repo}`, sub: "Issue event" }
    case "pull_request_review":
      return { title: `Review on ${repo}`, sub: "Review event" }
    default:
      return { title: type, sub: repo }
  }
}

export function TodayDashboard() {
  const [data, setData] = useState<TodayPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/today")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const today = data?.todayStats ?? {
    commits: 0,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
  }
  const yesterday = data?.yesterdayStats ?? {
    commits: 0,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
  }

  const hourly = Array.from({ length: 8 }, (_, i) => {
    const hour = i * 3
    const row = data?.serializedHourlyActivity.find((h) => h.hour === hour)
    return { label: String(hour).padStart(2, "0"), events: row?.count ?? 0 }
  })

  const breakdown = [
    { name: "Commits", value: today.commits, color: "#3fb950" },
    { name: "PRs", value: today.pullRequests, color: "#58a6ff" },
    { name: "Issues", value: today.issues, color: "#f78166" },
    { name: "Reviews", value: today.reviews, color: "#e3b341" },
  ].filter((d) => d.value > 0)

  const totalEvents = breakdown.reduce((s, d) => s + d.value, 0)
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  if (loading) {
    return (
      <div className="text-[var(--text-secondary)]">Loading today&apos;s activity…</div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Today"
        subtitle={`Live activity for ${dateLabel} — stats from webhooks (dailyStats)`}
        icon={Zap}
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--green-muted)] bg-[#0d2818] px-3 py-1 text-xs font-medium text-[var(--green)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--green)]" />
            Live
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Commits Today"
          value={today.commits}
          icon={GitCommit}
          trend={trend(today.commits, yesterday.commits)}
        />
        <MetricCard
          label="Pull Requests"
          value={today.pullRequests}
          icon={GitPullRequest}
          trend={trend(today.pullRequests, yesterday.pullRequests)}
        />
        <MetricCard
          label="Issues"
          value={today.issues}
          icon={CircleDot}
          trend={trend(today.issues, yesterday.issues)}
        />
        <MetricCard
          label="Reviews"
          value={today.reviews}
          icon={Eye}
          trend={trend(today.reviews, yesterday.reviews)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="mb-4 text-base font-semibold">Hourly Activity</h2>
          <div className="mb-3 flex gap-4 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              Events
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourly}>
              <CartesianGrid stroke="#30363d" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: "#8b949e", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="events" fill="#3fb950" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface p-5">
          <h2 className="mb-1 text-base font-semibold">Today&apos;s Breakdown</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            {totalEvents} processed events
          </p>
          {breakdown.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No activity yet today.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {breakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card-surface mt-6 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Live Event Feed</h2>
          <p className="text-xs text-[var(--text-muted)]">webhook · real-time</p>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {(data?.recentEvents ?? []).length === 0 ? (
            <li className="py-6 text-center text-sm text-[var(--text-secondary)]">
              Events will appear here as GitHub webhooks arrive.
            </li>
          ) : (
            data?.recentEvents.map((ev, i) => {
              const { title, sub } = eventLabel(ev.eventType, ev.payload)
              const color = EVENT_COLORS[ev.eventType] ?? "#8b949e"
              return (
                <li
                  key={`${ev.receivedAt}-${i}`}
                  className="flex items-start gap-3 py-3 first:pt-0"
                >
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--text-primary)]">{title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{sub}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--text-muted)]">
                    {timeAgo(ev.receivedAt)}
                  </span>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
