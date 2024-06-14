/*
  Warnings:

  - You are about to drop the column `event_id` on the `Div` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tmnt_id,div_name]` on the table `Div` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tmnt_id` to the `Div` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Div" DROP CONSTRAINT "Div_event_id_fkey";

-- DropIndex
DROP INDEX "Div_event_id_div_name_key";

-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Bracket" ALTER COLUMN "id" SET DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" DROP COLUMN "event_id",
ADD COLUMN     "tmnt_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Eliminator" ALTER COLUMN "id" SET DEFAULT concat('elm_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Lanes" ALTER COLUMN "id" SET DEFAULT concat('lns_', replace(cast(gen_random_uuid() as text), '-', ''));

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

-- CreateIndex
CREATE UNIQUE INDEX "Div_tmnt_id_div_name_key" ON "Div"("tmnt_id", "div_name");

-- AddForeignKey
ALTER TABLE "Div" ADD CONSTRAINT "Div_tmnt_id_fkey" FOREIGN KEY ("tmnt_id") REFERENCES "Tmnt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
