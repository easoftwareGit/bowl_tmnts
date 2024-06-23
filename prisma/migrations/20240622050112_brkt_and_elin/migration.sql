/*
  Warnings:

  - You are about to drop the `Bracket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Eliminator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bracket" DROP CONSTRAINT "Bracket_div_id_fkey";

-- DropForeignKey
ALTER TABLE "Bracket" DROP CONSTRAINT "Bracket_squad_id_fkey";

-- DropForeignKey
ALTER TABLE "Eliminator" DROP CONSTRAINT "Eliminator_div_id_fkey";

-- DropForeignKey
ALTER TABLE "Eliminator" DROP CONSTRAINT "Eliminator_squad_id_fkey";

-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Lane" ALTER COLUMN "id" SET DEFAULT concat('lan_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Pot" ALTER COLUMN "id" SET DEFAULT concat('pot_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Squad" ALTER COLUMN "id" SET DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- DropTable
DROP TABLE "Bracket";

-- DropTable
DROP TABLE "Eliminator";

-- CreateTable
CREATE TABLE "Brkt" (
    "id" TEXT NOT NULL DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', '')),
    "squad_id" TEXT NOT NULL,
    "div_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "players" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "first" DECIMAL(9,2) NOT NULL,
    "second" DECIMAL(9,2) NOT NULL,
    "admin" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brkt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elim" (
    "id" TEXT NOT NULL DEFAULT concat('elm_', replace(cast(gen_random_uuid() as text), '-', '')),
    "squad_id" TEXT NOT NULL,
    "div_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Elim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brkt_div_id_start_key" ON "Brkt"("div_id", "start");

-- CreateIndex
CREATE UNIQUE INDEX "Elim_div_id_start_games_key" ON "Elim"("div_id", "start", "games");

-- AddForeignKey
ALTER TABLE "Brkt" ADD CONSTRAINT "Brkt_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brkt" ADD CONSTRAINT "Brkt_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elim" ADD CONSTRAINT "Elim_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elim" ADD CONSTRAINT "Elim_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
