import { ShareButton } from "@/components/ShareButton"

export const ProfileHeader = ({
  username,
  name,
  avatarUrl,
  bio,
  publicRepos,
  followers,
  following,
}: {
  username: string
  name: string
  avatarUrl: string
  bio: string
  publicRepos: number
  followers: number
  following: number
}) => {
  return (
    <div className="card-surface relative p-6 md:p-8">
      <div className="absolute right-6 top-6">
        <ShareButton username={username} />
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <img
          src={avatarUrl || "/placeholder-avatar.png"}
          alt={`${username}'s avatar`}
          className="h-24 w-24 shrink-0 rounded-full border-2 border-[var(--border)] object-cover"
        />
        <div className="min-w-0 pr-24">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            {name}
          </h1>
          <p className="mt-1 text-[var(--accent)]">@{username}</p>
          {bio && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {bio}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-primary)]">
            <span>
              <strong>{publicRepos}</strong>{" "}
              <span className="text-[var(--text-secondary)]">Repos</span>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span>
              <strong>{followers.toLocaleString()}</strong>{" "}
              <span className="text-[var(--text-secondary)]">Followers</span>
            </span>
            <span className="text-[var(--border)]">|</span>
            <span>
              <strong>{following}</strong>{" "}
              <span className="text-[var(--text-secondary)]">Following</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
