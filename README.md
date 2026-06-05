# GitHub Stats Tracker

Aggregates GitHub events (pushes, pull requests, issues, reviews) into per-user daily stats.

## Features

- GitHub OAuth login via better-auth
- Webhook ingestion at `POST /api/webhooks/github` (HMAC-SHA256 verified)
- Daily aggregation cron (`GET /api/cron/aggregate` at midnight UTC)
- Weekly GitHub backfill cron (`GET /api/cron/backfill` Sundays at midnight UTC)
- Dashboard with Recharts bar chart

## Prerequisites

- Node.js, bun
- Postgres database
- GitHub OAuth App — create at https://github.com/settings/developers
- ngrok — for local webhook testing

## Setup

```sh
git clone <repo>
cd github-stats-tracker
bun install
cp .env.example .env   # fill in your values
bunx prisma migrate dev
bun dev
```

## Local Webhook Testing

```sh
ngrok http 3000
```

1. Copy the ngrok HTTPS URL.
2. Go to your repo **Settings > Webhooks > Add webhook**.
3. Set **Payload URL** to `https://<your-ngrok>.ngrok-free.dev/api/webhooks/github`.
4. Set **Content type** to `application/json`.
5. Set **Secret** to match `GITHUB_WEBHOOK_SECRET` in your `.env`.
6. Select the events you want to track (push, pull requests, issues, etc.).

The `allowedDevOrigins` in `next.config.ts` already allows the ngrok origin.

## Deployment

Deploy to **Vercel**. Set all environment variables from `.env.example` in the Vercel dashboard.

Vercel Cron is configured in `vercel.json`:
- `GET /api/cron/aggregate` — daily at midnight UTC
- `GET /api/cron/backfill` — weekly (Sundays at midnight UTC)

Vercel automatically sends the `CRON_SECRET` as a Bearer token.

## Architecture

```
GitHub event → POST /api/webhooks/github
                      ↓
              prisma.githubEvents (processed: false)
                      ↓  Vercel Cron (0 0 * * *)
              GET /api/cron/aggregate
                      ↓
              prisma.dailyStats (upserted per user/day)
                      ↓
              Dashboard (Recharts)
```

## Tech Stack

| Layer | Stack |
|---|---|
| Framework | Next.js 16.2.6 |
| UI | React 19, Tailwind v4, shadcn/ui, Recharts |
| Auth | better-auth (GitHub OAuth) |
| Database | Postgres via Prisma 7 + `@prisma/adapter-pg` |
| Scheduling | Vercel Cron Jobs |
