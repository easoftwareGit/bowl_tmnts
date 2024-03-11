/*
  Warnings:

  - You are about to drop the column `feature_id` on the `Div_Feat` table. All the data in the column will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `feat_id` to the `Div_Feat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Div_Feat" DROP CONSTRAINT "Div_Feat_feature_id_fkey";

-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div_Feat" DROP COLUMN "feature_id",
ADD COLUMN     "feat_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

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

-- DropTable
DROP TABLE "Feature";

-- CreateTable
CREATE TABLE "Feat" (
    "id" TEXT NOT NULL DEFAULT concat('fea_', replace(cast(gen_random_uuid() as text), '-', '')),
    "feature_name" TEXT NOT NULL,
    "entry_type" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Div_Feat" ADD CONSTRAINT "Div_Feat_feat_id_fkey" FOREIGN KEY ("feat_id") REFERENCES "Feat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
