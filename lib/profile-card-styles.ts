export const CARD_STYLES = [
  {
    id: "ocean",
    label: "Ocean",
    glow: "from-cyan-500/25 via-blue-600/15 to-emerald-500/25",
    ring: "ring-cyan-500/40",
    dot: "bg-gradient-to-br from-cyan-400 to-emerald-500",
  },
  {
    id: "purple",
    label: "Purple",
    glow: "from-purple-500/25 via-violet-600/15 to-fuchsia-500/20",
    ring: "ring-purple-500/40",
    dot: "bg-gradient-to-br from-purple-400 to-fuchsia-500",
  },
  {
    id: "sunset",
    label: "Sunset",
    glow: "from-orange-500/25 via-amber-500/15 to-rose-500/20",
    ring: "ring-orange-500/40",
    dot: "bg-gradient-to-br from-orange-400 to-rose-500",
  },
  {
    id: "slate",
    label: "Slate",
    glow: "from-zinc-400/15 via-zinc-600/10 to-zinc-700/20",
    ring: "ring-zinc-500/40",
    dot: "bg-gradient-to-br from-zinc-400 to-zinc-600",
  },
] as const

export type CardStyleId = (typeof CARD_STYLES)[number]["id"]
