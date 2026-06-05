-- CreateTable
CREATE TABLE "ContributionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "contributionCount" INTEGER NOT NULL,

    CONSTRAINT "ContributionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalRepos" INTEGER NOT NULL,
    "totalStars" INTEGER NOT NULL,
    "totalForks" INTEGER NOT NULL,
    "languages" JSONB NOT NULL,
    "totalPRs" INTEGER NOT NULL,
    "totalIssues" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContributionHistory_userId_date_key" ON "ContributionHistory"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProfile_userId_key" ON "GitHubProfile"("userId");

-- AddForeignKey
ALTER TABLE "ContributionHistory" ADD CONSTRAINT "ContributionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubProfile" ADD CONSTRAINT "GitHubProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
