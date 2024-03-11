/*
  Warnings:

  - You are about to drop the column `entry_fee` on the `Me_Div_Feat` table. All the data in the column will be lost.
  - Added the required column `fee` to the `Me_Div_Feat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div_Feat" ALTER COLUMN "id" SET DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Feat" ALTER COLUMN "id" SET DEFAULT concat('fea_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Hdcp" ALTER COLUMN "id" SET DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Me_Div_Feat" DROP COLUMN "entry_fee",
ADD COLUMN     "fee" DECIMAL(9,2) NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', ''));

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

-- CreateTable
CREATE TABLE "El_Div_Feat" (
    "id" TEXT NOT NULL DEFAULT concat('elf_', replace(cast(gen_random_uuid() as text), '-', '')),
    "div_feat_id" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "El_Div_Feat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "El_Div_Feat" ADD CONSTRAINT "El_Div_Feat_div_feat_id_fkey" FOREIGN KEY ("div_feat_id") REFERENCES "Div_Feat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
