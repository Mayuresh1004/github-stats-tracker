"use client"

import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleSignOut}
      onKeyDown={(e) => e.key === "Enter" && handleSignOut()}
      className="flex w-full cursor-pointer items-center gap-3"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </span>
  )
}
