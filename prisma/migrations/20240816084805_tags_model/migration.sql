-- CreateTable
CREATE TABLE "User" (
    "user_uuid" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateTable
CREATE TABLE "Home_entity" (
    "entity_uuid" TEXT NOT NULL,
    "user_nick_name" TEXT NOT NULL,
    "entity_order" SERIAL NOT NULL,
    "entity_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image_data" TEXT NOT NULL,
    "image_width" INTEGER NOT NULL,
    "image_height" INTEGER NOT NULL,
    "image_position" TEXT NOT NULL,
    "table_columns" JSONB NOT NULL,
    "table_data" JSONB NOT NULL,

    CONSTRAINT "Home_entity_pkey" PRIMARY KEY ("entity_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_name_key" ON "User"("nick_name");

-- CreateIndex
CREATE UNIQUE INDEX "Home_entity_user_nick_name_key" ON "Home_entity"("user_nick_name");

-- AddForeignKey
ALTER TABLE "Home_entity" ADD CONSTRAINT "Home_entity_user_nick_name_fkey" FOREIGN KEY ("user_nick_name") REFERENCES "User"("nick_name") ON DELETE RESTRICT ON UPDATE CASCADE;
