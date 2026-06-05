import { GitBranch } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function BrandLogo({
  href = "/",
  className,
  size = "default",
}: {
  href?: string
  className?: string
  size?: "default" | "sm"
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-bold text-[var(--accent)] transition-opacity hover:opacity-90",
        size === "sm" ? "text-lg" : "text-xl",
        className
      )}
    >
      <GitBranch className={size === "sm" ? "h-5 w-5" : "h-6 w-6"} strokeWidth={2.5} />
      <span>GitMaxxing</span>
    </Link>
  )
}
