-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "githubId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "bio" TEXT,
    "access_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubEvents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GithubEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dailyStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "commits" INTEGER NOT NULL,
    "pullRequests" INTEGER NOT NULL,
    "issues" INTEGER NOT NULL,
    "reviews" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_access_token_key" ON "User"("access_token");

-- AddForeignKey
ALTER TABLE "GithubEvents" ADD CONSTRAINT "GithubEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dailyStats" ADD CONSTRAINT "dailyStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
