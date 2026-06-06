"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Zap,
  User,
  Settings,
  LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import LogoutButton from "@/components/logout-button"

const navItems: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Today", url: "/today", icon: Zap },
  { title: "Profile", url: "/profile", icon: User },
  // { title: "Settings", url: "/settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()
  const items = navItems

  return (
    <nav className="mt-2 space-y-1">
      {items.map(({ title, url, icon: Icon }) => {
        const active =
          pathname === url ||
          (url === "/profile" && pathname.startsWith("/profile")) ||
          (url !== "/dashboard" &&
            url !== "/profile" &&
            pathname.startsWith(url))
        return (
          <Link
            key={title}
            href={url}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#1c2128] text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-[#1c2128]/60 hover:text-[var(--text-primary)]"
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-[var(--accent)]")} />
            {title}
          </Link>
        )
      })}
      <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[#1c2128]/60 hover:text-[var(--text-primary)]">
        <LogoutButton />
      </div>
    </nav>
  )
}
