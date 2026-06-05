import { BrandLogo } from "@/components/brand-logo"
import { SidebarNav } from "@/components/sidebar-nav"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      name: true,
      image: true,
      publicRepos: true,
      followers: true,
      following: true,
    },
  })

  return (
    <Sidebar className="border-r border-[var(--border)] bg-[var(--sidebar)]">
      <SidebarHeader className="border-b border-[var(--border)] px-4 py-4">
        <BrandLogo href="/dashboard" size="sm" />
        <div className="mt-5 flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt=""
              className="h-10 w-10 rounded-full border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[var(--surface)]" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {user?.name ?? "Developer"}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              @{user?.username ?? "user"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter className="border-t border-[var(--border)] p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Quick Stats
        </p>
        <dl className="space-y-2 text-xs">
          {[
            { label: "Public Repos", value: user?.publicRepos ?? 0 },
            { label: "Followers", value: user?.followers ?? 0 },
            { label: "Following", value: user?.following ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2">
              <dt className="text-[var(--text-muted)]">{label}</dt>
              <dd className="font-medium text-[var(--text-primary)]">
                {value.toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>
      </SidebarFooter>
    </Sidebar>
  )
}
