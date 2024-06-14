/*
  Warnings:

  - You are about to drop the `Hdcp` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[event_id,div_name]` on the table `Div` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmnt_id,event_name]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,squad_name]` on the table `Squad` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Hdcp" DROP CONSTRAINT "Hdcp_div_id_fkey";

-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Bracket" ALTER COLUMN "id" SET DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

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

-- DropTable
DROP TABLE "Hdcp";

-- CreateIndex
CREATE UNIQUE INDEX "Div_event_id_div_name_key" ON "Div"("event_id", "div_name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_tmnt_id_event_name_key" ON "Event"("tmnt_id", "event_name");

-- CreateIndex
CREATE UNIQUE INDEX "Squad_event_id_squad_name_key" ON "Squad"("event_id", "squad_name");
