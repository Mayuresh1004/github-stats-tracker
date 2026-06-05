import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { createAuthMiddleware } from "better-auth/api"
import { scheduleBackfillForNewUser } from "./backfill"
import { prisma } from "./db"

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET as string,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.BETTER_AUTH_URL as string],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const userId = ctx.context.newSession?.user.id
      if (!userId) return

      const account = await prisma.account.findFirst({
        where: { userId },
      })
      const accessToken = account?.accessToken

      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      const responseData = await response.json()

      await prisma.user.update({
        where: { id: userId },
        data: {
          access_token: accessToken,
          username: responseData.login,
          avatarUrl: responseData.avatar_url,
          bio: responseData.bio,
          githubId: responseData.id.toString(),
          publicRepos: responseData.public_repos,
          followers: responseData.followers,
          following: responseData.following,
        },
      })

      await scheduleBackfillForNewUser(userId)
    }),
  },
})
