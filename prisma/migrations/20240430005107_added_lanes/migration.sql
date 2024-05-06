/*
  Warnings:

  - Added the required column `players` to the `Bracket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lane_count` to the `Squad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starting_lane` to the `Squad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Bracket" ADD COLUMN     "players" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Eliminator" ALTER COLUMN "id" SET DEFAULT concat('elm_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Hdcp" ALTER COLUMN "id" SET DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Pot" ALTER COLUMN "id" SET DEFAULT concat('pot_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Squad" ADD COLUMN     "lane_count" INTEGER NOT NULL,
ADD COLUMN     "starting_lane" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- CreateTable
CREATE TABLE "Lanes" (
    "id" TEXT NOT NULL DEFAULT concat('lns_', replace(cast(gen_random_uuid() as text), '-', '')),
    "squad_id" TEXT NOT NULL,
    "lane_num" INTEGER NOT NULL,

    CONSTRAINT "Lanes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lanes" ADD CONSTRAINT "Lanes_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
