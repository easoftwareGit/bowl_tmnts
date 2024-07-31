/*
  Warnings:

  - Changed the type of `start_date` on the `Tmnt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end_date` on the `Tmnt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Brkt" ALTER COLUMN "id" SET DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Elim" ALTER COLUMN "id" SET DEFAULT concat('elm_', replace(cast(gen_random_uuid() as text), '-', ''));

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
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', '')),
DROP COLUMN "start_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "end_date",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));
