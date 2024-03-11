/*
  Warnings:

  - You are about to drop the column `amount` on the `Div_Feat` table. All the data in the column will be lost.
  - Added the required column `sort_order` to the `Div_Feat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `added_money` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div_Feat" DROP COLUMN "amount",
ADD COLUMN     "sort_order" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "added_money" DECIMAL(9,2) NOT NULL,
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

-- CreateTable
CREATE TABLE "Se_Div_Feat" (
    "id" TEXT NOT NULL DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', '')),
    "div_feat_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "entry_fee" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Se_Div_Feat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Me_Div_Feat" (
    "id" TEXT NOT NULL DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', '')),
    "div_feat_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "starting_game" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "bowlers" INTEGER NOT NULL,
    "entry_fee" DECIMAL(9,2) NOT NULL,
    "first" DECIMAL(9,2) NOT NULL,
    "second" DECIMAL(9,2) NOT NULL,
    "admin" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Me_Div_Feat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Se_Div_Feat" ADD CONSTRAINT "Se_Div_Feat_div_feat_id_fkey" FOREIGN KEY ("div_feat_id") REFERENCES "Div_Feat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Me_Div_Feat" ADD CONSTRAINT "Me_Div_Feat_div_feat_id_fkey" FOREIGN KEY ("div_feat_id") REFERENCES "Div_Feat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
