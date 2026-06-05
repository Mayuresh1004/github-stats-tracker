import { Code2 } from "lucide-react"

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#e3b341",
  Python: "#58a6ff",
  Go: "#00add8",
  Rust: "#f78166",
  Java: "#ffa657",
  Ruby: "#f778ba",
  CSS: "#a371f7",
  HTML: "#f78166",
  Shell: "#8b949e",
}

function barColor(name: string) {
  return LANGUAGE_COLORS[name] ?? "#8b949e"
}

export function TopLanguages({
  languages,
}: {
  languages: Record<string, number> | null | undefined
}) {
  const entries = languages
    ? Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : []
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0)

  return (
    <div className="card-surface flex h-full flex-col p-5">
      <div className="mb-4 flex items-center gap-2">
        <Code2 className="h-4 w-4 text-[var(--accent)]" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
          Top Languages
        </h2>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          Run profile backfill to load language stats from GitHub.
        </p>
      ) : (
        <ul className="space-y-4">
          {entries.map(([name, bytes]) => {
            const pct = total > 0 ? Math.round((bytes / total) * 100) : 0
            const color = barColor(name)
            return (
              <li key={name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[var(--text-primary)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {name}
                  </span>
                  <span className="text-[var(--text-secondary)]">{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
