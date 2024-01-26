import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function userUpsert() {
  const testPassword = await hash("test", 12);

  try {
    let user = await prisma.user.upsert({
      where: {
        id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
      },
      update: {},
      create: {
        id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        email: "adam@email.com",
        password: testPassword,
        first_name: "Adam",
        last_name: "Smith",
        phone: "+18005551212",
      },
    });
    user = await prisma.user.upsert({
      where: {
        id: "usr_516a113083983234fc316e31fb695b85",
      },
      update: {},
      create: {
        id: "usr_516a113083983234fc316e31fb695b85",
        email: "chad@email.com",
        password: testPassword,
        first_name: "Chad",
        last_name: "White",
        phone: "+18005557890",
      },
    });
    user = await prisma.user.upsert({
      where: {
        id: "usr_5735c309d480323662da31e13c35b91e",
      },
      update: {},
      create: {
        id: "usr_5735c309d480323662da31e13c35b91e",
        email: "doug@email.com",
        password: testPassword,
        first_name: "Doug",
        last_name: "Jones",
        phone: "+18005552211",
      },
    });
    user = await prisma.user.upsert({
      where: {
        id: "usr_a24894ed10c5dd835d5cbbfea7ac6dca",
      },
      update: {},
      create: {
        id: "usr_a24894ed10c5dd835d5cbbfea7ac6dca",
        email: "eric@email.com",
        password: testPassword,
        first_name: "Eric",
        last_name: "Johnson",
        phone: "+18005551234",
      },
    });
    user = await prisma.user.upsert({
      where: {
        id: "usr_07de11929565179487c7a04759ff9866",
      },
      update: {},
      create: {
        id: "usr_07de11929565179487c7a04759ff9866",
        email: "fred@email.com",
        password: testPassword,
        first_name: "Fred",
        last_name: "Green",
        phone: "+18005554321",
      },
    });
    console.log("Upserted users:", 5);
    return 5;
  } catch (error) {
    return -1;
  }
}

async function bowlUpsert() {
  try {
    let bowl = await prisma.bowl.upsert({
      where: {
        id: "bwl_561540bd64974da9abdd97765fdb3659",
      },
      update: {},
      create: {
        id: "bwl_561540bd64974da9abdd97765fdb3659",
        bowl_name: "Earl Anthony's Dublin Bowl",
        city: "Dublin",
        state: "CA",
        url: "https://www.earlanthonysdublinbowl.com/",
      },
    });
    bowl = await prisma.bowl.upsert({
      where: {
        id: "bwl_8b4a5c35ad1247049532ff53a12def0a",
      },
      update: {},
      create: {
        id: "bwl_8b4a5c35ad1247049532ff53a12def0a",
        bowl_name: "Yosemite Lanes",
        city: "Modesto",
        state: "CA",
        url: "http://yosemitelanes.com/",
      },
    });
    bowl = await prisma.bowl.upsert({
      where: {
        id: "bwl_ff4cd62b03f24017beea81c1d6e047e7",
      },
      update: {},
      create: {
        id: "bwl_ff4cd62b03f24017beea81c1d6e047e7",
        bowl_name: "Coconut Bowl",
        city: "Sparks",
        state: "NV",
        url: "https://wildisland.com/bowl/",
      },
    });
    console.log("Upserted bowls:", 3);
    return 3;
  } catch (error) {
    return -1;
  }
}

async function tmntUpsert() {
  try {
    let tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_fd99387c33d9c78aba290286576ddce5",
      },
      update: {},
      create: {
        id: "tmt_fd99387c33d9c78aba290286576ddce5",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Gold Pin",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date("10/23/2022"),
        end_date: new Date("10/23/2022"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_56d916ece6b50e6293300248c6792316",
      },
      update: {},
      create: {
        id: "tmt_56d916ece6b50e6293300248c6792316",
        user_id: "usr_516a113083983234fc316e31fb695b85",
        tmnt_name: "Scratch Tournament Series #1",
        bowl_id: "bwl_8b4a5c35ad1247049532ff53a12def0a",
        start_date: new Date("01/02/2023"),
        end_date: new Date("01/02/2023"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_d9b1af944d4941f65b2d2d4ac160cdea",
      },
      update: {},
      create: {
        id: "tmt_d9b1af944d4941f65b2d2d4ac160cdea",
        user_id: "usr_5735c309d480323662da31e13c35b91e",
        tmnt_name: "Coconut 5 Gamer",
        bowl_id: "bwl_ff4cd62b03f24017beea81c1d6e047e7",
        start_date: new Date("08/21/2022"),
        end_date: new Date("08/21/2022"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_467e51d71659d2e412cbc64a0d19ecb4",
      },
      update: {},
      create: {
        id: "tmt_467e51d71659d2e412cbc64a0d19ecb4",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Gold Pin",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date("09/16/2023"),
        end_date: new Date("09/16/2023"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_02e9022687d13c2c922d43682e6b6a80",
      },
      update: {},
      create: {
        id: "tmt_02e9022687d13c2c922d43682e6b6a80",
        user_id: "usr_5735c309d480323662da31e13c35b91e",
        tmnt_name: "Coconut Singles & Doubles",
        bowl_id: "bwl_ff4cd62b03f24017beea81c1d6e047e7",
        start_date: new Date("01/01/2023"),
        end_date: new Date("01/01/2023"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_a78f073789cc0f8a9a0de8c6e273eab1",
      },
      update: {},
      create: {
        id: "tmt_a78f073789cc0f8a9a0de8c6e273eab1",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Gold Pin",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date("01/02/2023"),
        end_date: new Date("01/02/2023"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_9a34a65584f94f548f5ce3b3becbca19",
      },
      update: {},
      create: {
        id: "tmt_9a34a65584f94f548f5ce3b3becbca19",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Masters",
        bowl_id: "bwl_8b4a5c35ad1247049532ff53a12def0a",
        start_date: new Date("01/05/2023"),
        end_date: new Date("01/05/2023"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_718fe20f53dd4e539692c6c64f991bbe",
      },
      update: {},
      create: {
        id: "tmt_718fe20f53dd4e539692c6c64f991bbe",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "2-Day event",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date("04/20/2024"),
        end_date: new Date("04/21/2024"),
      },
    });
    tmnt = await prisma.tmnt.upsert({
      where: {
        id: "tmt_e134ac14c5234d708d26037ae812ac33",
      },
      update: {},
      create: {
        id: "tmt_e134ac14c5234d708d26037ae812ac33",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Gold Pin",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date("08/19/2024"),
        end_date: new Date("08/19/2024"),
      },
    });
    console.log("Upserted tmnts:", 9);
    return 9
  } catch (error) {
    return -1;
  }
}

async function main() {

  let count = await userUpsert();
  if (count < 0) return;

  count = await bowlUpsert();
  if (count < 0) return;

  count = await tmntUpsert();
  if (count < 0) return;
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
