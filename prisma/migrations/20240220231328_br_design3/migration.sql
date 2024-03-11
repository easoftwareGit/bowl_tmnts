/*
  Warnings:

  - You are about to drop the column `br_div_feat_id` on the `Br_Design` table. All the data in the column will be lost.
  - You are about to drop the column `admin` on the `Br_Div_Feat` table. All the data in the column will be lost.
  - You are about to drop the column `bowlers` on the `Br_Div_Feat` table. All the data in the column will be lost.
  - You are about to drop the column `fee` on the `Br_Div_Feat` table. All the data in the column will be lost.
  - You are about to drop the column `first` on the `Br_Div_Feat` table. All the data in the column will be lost.
  - You are about to drop the column `games` on the `Br_Div_Feat` table. All the data in the column will be lost.
  - You are about to drop the column `second` on the `Br_Div_Feat` table. All the data in the column will be lost.
  - Added the required column `div_feat_id` to the `Br_Design` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Br_Design" DROP CONSTRAINT "Br_Design_br_div_feat_id_fkey";

-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Br_Design" DROP COLUMN "br_div_feat_id",
ADD COLUMN     "div_feat_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('brd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Br_Div_Feat" DROP COLUMN "admin",
DROP COLUMN "bowlers",
DROP COLUMN "fee",
DROP COLUMN "first",
DROP COLUMN "games",
DROP COLUMN "second",
ALTER COLUMN "id" SET DEFAULT concat('brf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div_Feat" ALTER COLUMN "id" SET DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "El_Div_Feat" ALTER COLUMN "id" SET DEFAULT concat('elf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Feat" ALTER COLUMN "id" SET DEFAULT concat('fea_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Hdcp" ALTER COLUMN "id" SET DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Se_Div_Feat" ALTER COLUMN "id" SET DEFAULT concat('sef_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Squad" ALTER COLUMN "id" SET DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AddForeignKey
ALTER TABLE "Br_Design" ADD CONSTRAINT "Br_Design_div_feat_id_fkey" FOREIGN KEY ("div_feat_id") REFERENCES "Div_Feat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
