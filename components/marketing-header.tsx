"use client"

import { BrandLogo } from "@/components/brand-logo"
import { signIn } from "@/lib/auth-client"

export function MarketingHeader({ showSignIn = true }: { showSignIn?: boolean }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 md:px-10">
      <BrandLogo />
      {showSignIn && (
        <button
          type="button"
          onClick={() => signIn()}
          className="text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
        >
          Sign in with GitHub
        </button>
      )}
    </header>
  )
}
