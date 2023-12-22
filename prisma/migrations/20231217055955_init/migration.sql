-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', '')),
    "email" VARCHAR NOT NULL,
    "password_hash" TEXT,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tmnt" (
    "id" TEXT NOT NULL DEFAULT concat('tmt_', replace(cast(gen_random_uuid() as text), '-', '')),
    "user_id" TEXT NOT NULL,
    "tmnt_name" VARCHAR NOT NULL,
    "bowl_name" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tmnt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL DEFAULT concat('evt_', replace(cast(gen_random_uuid() as text), '-', '')),
    "tmnt_id" TEXT NOT NULL,
    "event_name" VARCHAR NOT NULL,
    "team_size" INTEGER NOT NULL,
    "games" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" TEXT NOT NULL DEFAULT concat('sqd_', replace(cast(gen_random_uuid() as text), '-', '')),
    "event_id" TEXT NOT NULL,
    "squad_name" VARCHAR NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME(6) NOT NULL,
    "games" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Div" (
    "id" TEXT NOT NULL DEFAULT concat('div_', replace(cast(gen_random_uuid() as text), '-', '')),
    "event_id" TEXT NOT NULL,
    "div_name" VARCHAR NOT NULL,
    "hdcp" BOOLEAN NOT NULL,
    "pots" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Div_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hdcp" (
    "id" TEXT NOT NULL DEFAULT concat('hdc_', replace(cast(gen_random_uuid() as text), '-', '')),
    "div_id" TEXT NOT NULL,
    "hdcp_per" DOUBLE PRECISION NOT NULL,
    "hdcp_from" INTEGER NOT NULL,
    "int_hdcp" BOOLEAN NOT NULL,
    "games" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hdcp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL DEFAULT concat('ply_', replace(cast(gen_random_uuid() as text), '-', '')),
    "tmnt_id" TEXT NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "average" INTEGER,
    "usbc" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "player_id" TEXT NOT NULL,
    "div_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "squad_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "game_num" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lane_asmt" (
    "id" SERIAL NOT NULL,
    "lane" INTEGER NOT NULL,
    "player_id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "position" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lane_asmt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_player_id_div_id_key" ON "Entry"("player_id", "div_id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_squad_id_player_id_game_num_key" ON "Game"("squad_id", "player_id", "game_num");

-- CreateIndex
CREATE UNIQUE INDEX "Lane_asmt_lane_position_key" ON "Lane_asmt"("lane", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Lane_asmt_player_id_squad_id_key" ON "Lane_asmt"("player_id", "squad_id");

-- AddForeignKey
ALTER TABLE "Tmnt" ADD CONSTRAINT "Tmnt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tmnt_id_fkey" FOREIGN KEY ("tmnt_id") REFERENCES "Tmnt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Div" ADD CONSTRAINT "Div_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Hdcp" ADD CONSTRAINT "Hdcp_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_tmnt_id_fkey" FOREIGN KEY ("tmnt_id") REFERENCES "Tmnt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_div_id_fkey" FOREIGN KEY ("div_id") REFERENCES "Div"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Lane_asmt" ADD CONSTRAINT "Lane_asmt_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Lane_asmt" ADD CONSTRAINT "Lane_asmt_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "Squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
