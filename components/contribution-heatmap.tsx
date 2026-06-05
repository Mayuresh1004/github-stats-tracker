"use client"

import { GitHubCalendar } from "react-github-calendar"
import { useEffect, useRef, useState } from "react"

const WEEKS = 53
const BLOCK_MARGIN = 3
const MAX_BLOCK_SIZE = 12
const MIN_BLOCK_SIZE = 3
const WEEKDAY_LABEL_RESERVE = 40
const FOOTER_HEIGHT = 32

function getBlockSize(containerWidth: number, showWeekdayLabels: boolean) {
  const reserve = showWeekdayLabels ? WEEKDAY_LABEL_RESERVE : 0
  const available = containerWidth - reserve - 4
  const raw = Math.floor((available - WEEKS * BLOCK_MARGIN) / WEEKS)
  return Math.max(MIN_BLOCK_SIZE, Math.min(MAX_BLOCK_SIZE, raw))
}

function getCalendarHeight(blockSize: number) {
  const fontSize = blockSize <= 7 ? 10 : 12
  const labelHeight = fontSize + 8
  const gridHeight = labelHeight + (blockSize + BLOCK_MARGIN) * 7 - BLOCK_MARGIN
  return gridHeight + FOOTER_HEIGHT
}

export function ContributionHeatmap({
  username,
  title,
  className,
}: {
  username: string
  title?: string
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateWidth = () => {
      setContainerWidth(container.clientWidth)
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const showWeekdayLabels = containerWidth >= 360
  const blockSize =
    containerWidth > 0
      ? getBlockSize(containerWidth, showWeekdayLabels)
      : MAX_BLOCK_SIZE
  const fontSize = blockSize <= 7 ? 10 : 12
  const calendarHeight = getCalendarHeight(blockSize)

  if (!username) {
    return (
      <div className="card-surface p-6 text-sm text-[var(--text-secondary)]">
        GitHub username not set on your profile yet.
      </div>
    )
  }

  return (
    <div className={`card-surface min-w-0 p-5 ${className ?? ""}`}>
      {title && (
        <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      )}
      <div
        ref={containerRef}
        className="min-w-0 overflow-hidden [&_.react-activity-calendar__scroll-container]:!overflow-x-hidden"
        style={{ minHeight: calendarHeight }}
      >
        {mounted && containerWidth > 0 ? (
          <GitHubCalendar
            username={username}
            colorScheme="dark"
            theme={{
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            blockSize={blockSize}
            blockMargin={BLOCK_MARGIN}
            fontSize={fontSize}
            weekStart={0}
            showWeekdayLabels={
              showWeekdayLabels ? ["mon", "wed", "fri"] : false
            }
            showTotalCount={!title}
            tooltips={{
              activity: {
                text: (activity) =>
                  activity.count +
                  " contribution" +
                  (activity.count !== 1 ? "s" : ""),
              },
            }}
          />
        ) : (
          <div
            className="h-[120px] animate-pulse rounded-lg bg-[var(--border)]/40"
            aria-hidden
          />
        )}
      </div>
    </div>
  )
}
