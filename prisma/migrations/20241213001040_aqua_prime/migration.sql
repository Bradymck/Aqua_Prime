/*
  Warnings:

  - You are about to drop the `UserDislike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLike" DROP CONSTRAINT "UserLike_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isInGlobalPool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerAddress" TEXT;

-- DropTable
DROP TABLE "UserDislike";

-- DropTable
DROP TABLE "UserLike";

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dislike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "Like_profileId_idx" ON "Like"("profileId");

-- CreateIndex
CREATE INDEX "Dislike_userId_idx" ON "Dislike"("userId");

-- CreateIndex
CREATE INDEX "Dislike_profileId_idx" ON "Dislike"("profileId");

-- CreateIndex
CREATE INDEX "Profile_ownerAddress_idx" ON "Profile"("ownerAddress");

-- CreateIndex
CREATE INDEX "Profile_isInGlobalPool_isActive_idx" ON "Profile"("isInGlobalPool", "isActive");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
