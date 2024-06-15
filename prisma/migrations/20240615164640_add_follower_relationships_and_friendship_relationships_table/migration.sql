-- CreateTable
CREATE TABLE "follower_relationships" (
    "id" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follower_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendship_relationships" (
    "id" UUID NOT NULL,
    "initiatorId" UUID NOT NULL,
    "acceptorId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendship_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "follower_relationships_followerId_followingId_key" ON "follower_relationships"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "friendship_relationships_initiatorId_acceptorId_key" ON "friendship_relationships"("initiatorId", "acceptorId");

-- AddForeignKey
ALTER TABLE "follower_relationships" ADD CONSTRAINT "follower_relationships_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follower_relationships" ADD CONSTRAINT "follower_relationships_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship_relationships" ADD CONSTRAINT "friendship_relationships_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship_relationships" ADD CONSTRAINT "friendship_relationships_acceptorId_fkey" FOREIGN KEY ("acceptorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
