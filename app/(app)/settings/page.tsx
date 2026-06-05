import { PageHeader } from "@/components/page-header"
import { Settings } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/")
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Account and integration preferences."
        icon={Settings}
      />
      <div className="card-surface max-w-lg p-6 text-sm text-[var(--text-secondary)]">
        Settings are coming soon. Connect webhooks from your GitHub repository
        settings to start streaming live activity on the Today page.
      </div>
    </>
  )
}
