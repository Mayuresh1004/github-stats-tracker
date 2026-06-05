"use client"

import { BrandLogo } from "@/components/brand-logo"
import { signIn } from "@/lib/auth-client"
import { GitBranch, BarChart3, Share2, Sparkles } from "lucide-react"
import Link from "next/link"

function DashboardPreview() {
  const stats = [
    { label: "Commits", value: "2,481" },
    { label: "Pull Requests", value: "312" },
    { label: "Issues", value: "154" },
    { label: "PRs Merged", value: "289" },
    { label: "Reviews", value: "97" },
  ]

  return (
    <div id="preview" className="mx-auto mt-16 max-w-4xl px-4">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[#0d1117] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 rounded-md bg-[#21262d] px-3 py-1 text-xs text-[var(--text-muted)]">
            gitmaxxing.dev/dashboard
          </span>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 md:gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-[var(--border)] bg-[#0d1117] p-3"
              >
                <p className="text-[10px] uppercase text-[var(--text-muted)]">
                  {s.label}
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[#0d1117] p-4">
            <p className="mb-3 text-sm text-[var(--text-secondary)]">
              412 contributions in the last year
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 52 * 7 }).map((_, i) => {
                const level = (i * 7) % 5
                const colors = [
                  "#161b22",
                  "#0e4429",
                  "#006d32",
                  "#26a641",
                  "#39d353",
                ]
                return (
                  <div
                    key={i}
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: colors[level] }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingPage({
  demoProfileUsername,
}: {
  demoProfileUsername: string | null
}) {
  const demoProfileHref = demoProfileUsername
    ? `/u/${demoProfileUsername}`
    : null

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <BrandLogo />
        <button
          type="button"
          onClick={() => signIn()}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
        >
          Sign in with GitHub
        </button>
      </header>

      <main className="px-6 pb-16 md:px-10">
        <section className="mx-auto max-w-3xl pt-12 text-center md:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--green-muted)] bg-[#0d2818] px-3 py-1 text-xs font-medium text-[var(--green)]">
            <Sparkles className="h-3 w-3" />
            Now with real-time webhooks
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-6xl">
            Track your{" "}
            <span className="text-[var(--accent)]">GitHub</span> journey
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--text-secondary)] md:text-lg">
            Visualize commits, streaks, and contributions. Share your developer
            story with a beautiful public profile.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => signIn()}
              className="rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
            >
              Sign in with GitHub
            </button>
            {demoProfileHref ? (
              <Link
                href={demoProfileHref}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs">
                  👤
                </span>
                View Demo Profile
              </Link>
            ) : null}
          </div>
        </section>

        <section className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-3 md:gap-6">
          {[
            {
              icon: GitBranch,
              title: "Real-time Webhooks",
              desc: "Every push, PR, and issue streams in instantly from GitHub.",
            },
            {
              icon: BarChart3,
              title: "Rich Analytics",
              desc: "Commits, streaks, heatmaps, and activity charts at a glance.",
            },
            {
              icon: Share2,
              title: "Public Profiles",
              desc: "Share a beautiful stats page with recruiters and your network.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-surface p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d1117]">
                <Icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {desc}
              </p>
            </div>
          ))}
        </section>

        <DashboardPreview />
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        © {new Date().getFullYear()} GitMaxxing — Built for developers
      </footer>
    </div>
  )
}
