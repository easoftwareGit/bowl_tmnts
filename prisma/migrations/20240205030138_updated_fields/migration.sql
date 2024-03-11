/*
  Warnings:

  - You are about to drop the column `hdcp` on the `Div` table. All the data in the column will be lost.
  - You are about to drop the column `pots` on the `Div` table. All the data in the column will be lost.
  - You are about to drop the column `games` on the `Hdcp` table. All the data in the column will be lost.
  - You are about to drop the column `hdcp_per` on the `Hdcp` table. All the data in the column will be lost.
  - Added the required column `hdcp_per` to the `Div` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort_order` to the `Div` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort_order` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game` to the `Hdcp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort_order` to the `Squad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Div" DROP COLUMN "hdcp",
DROP COLUMN "pots",
ADD COLUMN     "hdcp_per" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sort_order" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "sort_order" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Hdcp" DROP COLUMN "games",
DROP COLUMN "hdcp_per",
ADD COLUMN     "game" BOOLEAN NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Squad" ADD COLUMN     "sort_order" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tmnt" ALTER COLUMN "id" SET DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "tmnt_name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL DEFAULT concat('fea_', replace(cast(gen_random_uuid() as text), '-', '')),
    "name" TEXT NOT NULL,
    "entry_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Div_Feat" (
    "id" TEXT NOT NULL DEFAULT concat('dvf_', replace(cast(gen_random_uuid() as text), '-', '')),
    "div_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "amount" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Div_Feat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Div_Feat" ADD CONSTRAINT "Div_Feat_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Div_Feat" ADD CONSTRAINT "Div_Feat_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
