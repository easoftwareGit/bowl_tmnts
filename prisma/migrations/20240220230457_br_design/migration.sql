-- AlterTable
ALTER TABLE "Bowl" ALTER COLUMN "id" SET DEFAULT concat('bwl_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Br_Div_Feat" ALTER COLUMN "id" SET DEFAULT concat('brf_', replace(cast(gen_random_uuid() as text), '-', ''));

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

-- CreateTable
CREATE TABLE "Br_Design" (
    "id" TEXT NOT NULL DEFAULT concat('brk_', replace(cast(gen_random_uuid() as text), '-', '')),
    "br_div_feat_id" TEXT NOT NULL,
    "games" INTEGER NOT NULL,
    "bowlers" INTEGER NOT NULL,
    "fee" DECIMAL(9,2) NOT NULL,
    "first" DECIMAL(9,2) NOT NULL,
    "second" DECIMAL(9,2) NOT NULL,
    "admin" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Br_Design_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Br_Design" ADD CONSTRAINT "Br_Design_br_div_feat_id_fkey" FOREIGN KEY ("br_div_feat_id") REFERENCES "Br_Div_Feat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
