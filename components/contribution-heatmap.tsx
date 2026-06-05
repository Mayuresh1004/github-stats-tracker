"use client"

import { GitHubCalendar } from "react-github-calendar"
import { useEffect, useState } from "react"

type Tip = { x: number; y: number; content: string } | null

export function ContributionHeatmap({
  username,
  title,
  className,
}: {
  username: string
  title?: string
  className?: string
}) {
  const [tip, setTip] = useState<Tip>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!username) {
    return (
      <div className="card-surface p-6 text-sm text-[var(--text-secondary)]">
        GitHub username not set on your profile yet.
      </div>
    )
  }

  return (
    <div className={`card-surface overflow-hidden p-5 ${className ?? ""}`}>
      {title && (
        <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      )}
      <div className="min-h-[120px] overflow-x-auto">
        {mounted ? (
          <GitHubCalendar
            username={username}
            colorScheme="dark"
            theme={{
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            blockSize={11}
            blockMargin={3}
            fontSize={12}
            renderBlock={(block, activity) => {
              const handleEnter = (e: React.MouseEvent<SVGGElement>) => {
                const r = e.currentTarget.getBoundingClientRect()
                setTip({
                  x: r.left + r.width / 2,
                  y: r.top - 8,
                  content:
                    activity.count +
                    " contribution" +
                    (activity.count !== 1 ? "s" : ""),
                })
              }
              return (
                <g
                  onMouseEnter={handleEnter}
                  onMouseLeave={() => setTip(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={block.props.x}
                    y={block.props.y}
                    width={block.props.width}
                    height={block.props.height}
                    fill={block.props.fill}
                    rx={2}
                  />
                </g>
              )
            }}
          />
        ) : (
          <div
            className="h-[120px] animate-pulse rounded-lg bg-[var(--border)]/40"
            aria-hidden
          />
        )}
      </div>
      {tip && (
        <div
          style={{
            position: "fixed",
            left: tip.x,
            top: tip.y,
            transform: "translate(-50%, -100%)",
            background: "#383838",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          {tip.content}
        </div>
      )}
    </div>
  )
}
