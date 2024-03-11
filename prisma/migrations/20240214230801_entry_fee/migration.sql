/*
  Warnings:

  - Added the required column `entry_fee` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expenses` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineage` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `other` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prize_fund` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div_Feat" ALTER COLUMN "id" SET DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "entry_fee" DECIMAL(9,2) NOT NULL,
ADD COLUMN     "expenses" DECIMAL(9,2) NOT NULL,
ADD COLUMN     "lineage" DECIMAL(9,2) NOT NULL,
ADD COLUMN     "other" DECIMAL(9,2) NOT NULL,
ADD COLUMN     "prize_fund" DECIMAL(9,2) NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Feat" ALTER COLUMN "id" SET DEFAULT concat('fea_', replace(cast(gen_random_uuid() as text), '-', ''));

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
