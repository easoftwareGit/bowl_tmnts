/*
  Warnings:

  - You are about to drop the column `bowl_name` on the `Tmnt` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Tmnt` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Tmnt` table. All the data in the column will be lost.
  - Added the required column `bowl_id` to the `Tmnt` table without a default value. This is not possible if the table is not empty.

*/
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
ALTER TABLE "Tmnt" DROP COLUMN "bowl_name",
DROP COLUMN "city",
DROP COLUMN "state",
ADD COLUMN     "bowl_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- CreateTable
CREATE TABLE "Bowl" (
    "id" TEXT NOT NULL DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', '')),
    "bowl_name" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bowl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tmnt" ADD CONSTRAINT "Tmnt_bowl_id_fkey" FOREIGN KEY ("bowl_id") REFERENCES "Bowl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
