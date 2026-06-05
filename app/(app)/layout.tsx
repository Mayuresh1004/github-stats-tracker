import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#121212]">
        <header className="flex h-12 items-center gap-2 border-b border-[var(--border)] px-4 md:hidden">
          <SidebarTrigger className="text-[var(--text-secondary)]" />
        </header>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
