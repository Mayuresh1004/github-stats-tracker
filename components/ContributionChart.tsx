"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const chartColors = {
  commits: "#3fb950",
  pullRequests: "#58a6ff",
  issues: "#f78166",
}

export default function ContributionChart({
  data,
  title = "Activity Over Time",
  variant = "webhook",
}: {
  data: {
    date: string
    commits: number
    pullRequests: number
    issues: number
  }[]
  title?: string
  variant?: "webhook" | "contributions"
}) {
  const recent = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-15)

  const isContributions = variant === "contributions"

  return (
    <div className="card-surface p-5">
      <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
          {isContributions ? "Contributions" : "Commits"}
        </span>
        {!isContributions && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--blue)]" />
              PRs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--orange)]" />
              Issues
            </span>
          </>
        )}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={recent} barGap={2} barCategoryGap="20%">
          <CartesianGrid stroke="#30363d" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8b949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            tick={{ fill: "#8b949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e6edf3" }}
          />
          <Legend wrapperStyle={{ display: "none" }} />
          <Bar dataKey="commits" fill={chartColors.commits} radius={[3, 3, 0, 0]} />
          {!isContributions && (
            <>
              <Bar
                dataKey="pullRequests"
                fill={chartColors.pullRequests}
                radius={[3, 3, 0, 0]}
              />
              <Bar dataKey="issues" fill={chartColors.issues} radius={[3, 3, 0, 0]} />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
