-- CreateTable
CREATE TABLE "NFTMetadata" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "metadataUri" TEXT NOT NULL,
    "imageUri" TEXT NOT NULL,
    "traits" JSONB NOT NULL,
    "dialogueStyle" TEXT[],
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lastInteraction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NFTMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreMemory" (
    "id" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "baseTraits" TEXT[],
    "originStory" TEXT NOT NULL,
    "fundamentalValues" TEXT[],
    "emotionalBaseline" DOUBLE PRECISION NOT NULL,
    "era" TEXT NOT NULL,
    "culturalContext" TEXT[],
    "basicTruths" TEXT[],
    "userTrust" DOUBLE PRECISION NOT NULL,
    "userAffinity" DOUBLE PRECISION NOT NULL,
    "significantInteractions" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoreMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" SERIAL NOT NULL,
    "nftId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "ethAddress" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "ethAddress" TEXT NOT NULL,
    "sandDollars" INTEGER NOT NULL DEFAULT 0,
    "batteryLevel" INTEGER NOT NULL DEFAULT 100,
    "moonstonesBurned" INTEGER NOT NULL DEFAULT 0,
    "lastBatteryUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BalanceTransaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BalanceTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SHORT_TERM',
    "sentiment" DOUBLE PRECISION NOT NULL,
    "importance" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topics" TEXT[],

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "ethAddress" TEXT,
    "miningRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "moonstoneMined" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastMiningCheck" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinate" (
    "id" SERIAL NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "ownerId" INTEGER,
    "miningStart" TIMESTAMP(3),
    "lastMined" TIMESTAMP(3),

    CONSTRAINT "Coordinate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordinateMemory" (
    "id" SERIAL NOT NULL,
    "coordinateId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "transcript" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoordinateMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiningHistory" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "coordinateId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MiningHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nftMetadata" JSONB NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "profileData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDislike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDislike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFTMetadata_tokenId_key" ON "NFTMetadata"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreMemory_nftId_key" ON "CoreMemory"("nftId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_ethAddress_key" ON "UserProfile"("ethAddress");

-- CreateIndex
CREATE INDEX "Memory_nftId_idx" ON "Memory"("nftId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_ethAddress_key" ON "Player"("ethAddress");

-- CreateIndex
CREATE INDEX "UserLike_userId_idx" ON "UserLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLike_userId_profileId_key" ON "UserLike"("userId", "profileId");

-- CreateIndex
CREATE INDEX "UserDislike_userId_idx" ON "UserDislike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDislike_userId_profileId_key" ON "UserDislike"("userId", "profileId");

-- AddForeignKey
ALTER TABLE "CoreMemory" ADD CONSTRAINT "CoreMemory_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFTMetadata"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFTMetadata"("tokenId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFTMetadata"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceTransaction" ADD CONSTRAINT "BalanceTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coordinate" ADD CONSTRAINT "Coordinate_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinateMemory" ADD CONSTRAINT "CoordinateMemory_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "Coordinate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLike" ADD CONSTRAINT "UserLike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
