-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "bio" TEXT,
    "profile_picture_url" TEXT,
    "cover_photo_url" TEXT,
    "email" TEXT NOT NULL,
    "is_email_verified" BOOLEAN DEFAULT false,
    "password" TEXT,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "followings_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
