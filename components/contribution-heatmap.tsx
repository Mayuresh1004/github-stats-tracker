"use client"

import { GitHubCalendar } from "react-github-calendar"
import { useEffect, useRef, useState } from "react"

const BLOCK_SIZE = 11
const BLOCK_MARGIN = 3
const FONT_SIZE = 12

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
  const calendarRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [calendarWidth, setCalendarWidth] = useState(0)
  const [calendarHeight, setCalendarHeight] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateContainerWidth = () => {
      setContainerWidth(container.clientWidth)
    }

    updateContainerWidth()
    const observer = new ResizeObserver(updateContainerWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const calendar = calendarRef.current
    if (!calendar || !mounted) return

    const updateCalendarSize = () => {
      setCalendarWidth(calendar.scrollWidth)
      setCalendarHeight(calendar.scrollHeight)
    }

    updateCalendarSize()
    const observer = new ResizeObserver(updateCalendarSize)
    observer.observe(calendar)
    return () => observer.disconnect()
  }, [mounted, username])

  const showWeekdayLabels = containerWidth >= 360
  const scale =
    calendarWidth > 0 && containerWidth > 0
      ? Math.min(1, containerWidth / calendarWidth)
      : 1
  const scaledHeight = calendarHeight > 0 ? calendarHeight * scale : 120

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
        className="min-w-0 overflow-hidden"
        style={{ height: mounted ? scaledHeight : 120 }}
      >
        {mounted ? (
          <div
            ref={calendarRef}
            className="origin-top-left [&_.react-activity-calendar__scroll-container]:!overflow-x-hidden"
            style={{
              transform: `scale(${scale})`,
              width: scale < 1 ? calendarWidth || undefined : undefined,
            }}
          >
            <GitHubCalendar
              username={username}
              colorScheme="dark"
              theme={{
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              }}
              blockSize={BLOCK_SIZE}
              blockMargin={BLOCK_MARGIN}
              fontSize={FONT_SIZE}
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
          </div>
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
