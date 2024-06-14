/*
  Warnings:

  - Added the required column `hdcp_from` to the `Div` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Bracket" ALTER COLUMN "id" SET DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ADD COLUMN     "hdcp_for" TEXT NOT NULL DEFAULT 'Game',
ADD COLUMN     "hdcp_from" INTEGER NOT NULL,
ADD COLUMN     "int_hdcp" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Eliminator" ALTER COLUMN "id" SET DEFAULT concat('elm_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Hdcp" ALTER COLUMN "id" SET DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Lanes" ALTER COLUMN "id" SET DEFAULT concat('lns_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Pot" ALTER COLUMN "id" SET DEFAULT concat('pot_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Squad" ALTER COLUMN "id" SET DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "start_date" SET DATA TYPE TEXT,
ALTER COLUMN "end_date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));
