/*
  Warnings:

  - You are about to drop the `Br_Design` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Br_Div_Feat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Div_Feat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `El_Div_Feat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Se_Div_Feat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Br_Design" DROP CONSTRAINT "Br_Design_div_feat_id_fkey";

-- DropForeignKey
ALTER TABLE "Br_Div_Feat" DROP CONSTRAINT "Br_Div_Feat_div_feat_id_fkey";

-- DropForeignKey
ALTER TABLE "Div_Feat" DROP CONSTRAINT "Div_Feat_div_id_fkey";

-- DropForeignKey
ALTER TABLE "Div_Feat" DROP CONSTRAINT "Div_Feat_feat_id_fkey";

-- DropForeignKey
ALTER TABLE "El_Div_Feat" DROP CONSTRAINT "El_Div_Feat_div_feat_id_fkey";

-- DropForeignKey
ALTER TABLE "Se_Div_Feat" DROP CONSTRAINT "Se_Div_Feat_div_feat_id_fkey";

-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Hdcp" ALTER COLUMN "id" SET DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Squad" ALTER COLUMN "id" SET DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- DropTable
DROP TABLE "Br_Design";

-- DropTable
DROP TABLE "Br_Div_Feat";

-- DropTable
DROP TABLE "Div_Feat";

-- DropTable
DROP TABLE "El_Div_Feat";

-- DropTable
DROP TABLE "Feat";

-- DropTable
DROP TABLE "Se_Div_Feat";

-- CreateTable
CREATE TABLE "Pot" (
    "id" TEXT NOT NULL DEFAULT concat('pot_', replace(cast(gen_random_uuid() as text), '-', '')),
    "squad_id" TEXT NOT NULL,
    "div_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "pot_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bracket" (
    "id" TEXT NOT NULL DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', '')),
    "squad_id" TEXT NOT NULL,
    "div_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "first" DECIMAL(9,2) NOT NULL,
    "second" DECIMAL(9,2) NOT NULL,
    "admin" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bracket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eliminator" (
    "id" TEXT NOT NULL DEFAULT concat('elm_', replace(cast(gen_random_uuid() as text), '-', '')),
    "squad_id" TEXT NOT NULL,
    "div_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Eliminator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pot" ADD CONSTRAINT "Pot_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pot" ADD CONSTRAINT "Pot_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bracket" ADD CONSTRAINT "Bracket_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bracket" ADD CONSTRAINT "Bracket_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eliminator" ADD CONSTRAINT "Eliminator_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eliminator" ADD CONSTRAINT "Eliminator_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
