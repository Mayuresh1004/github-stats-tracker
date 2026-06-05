export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    const n = value / 1_000_000
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}m`
  }
  if (value >= 1_000) {
    const n = value / 1_000
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}k`
  }
  return value.toLocaleString()
}
