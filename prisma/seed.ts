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
    console.log(error)
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
    console.log(error)
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
        tmnt_name: "Yosemite 6 Gamer",
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
        id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      },
      update: {},
      create: {
        id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "New Year's Eve 6 Gamer",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date("12/31/2023"),
        end_date: new Date("12/31/2023"),
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
    console.log("Upserted tmnts:", 10);
    return 10
  } catch (error) {
    console.log(error)
    return -1;
  }
}

async function eventUpsert() {

  try {
    let event = await prisma.event.upsert({
      where: {
        id: "evt_cb97b73cb538418ab993fc867f860510",
      },
      update: {},
      create: {
        id: "evt_cb97b73cb538418ab993fc867f860510",
        tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
        event_name: "Singles",
        team_size: 1,
        games: 6,
        entry_fee: 80,
        lineage: 18,
        prize_fund: 55,
        other: 2,
        expenses: 5,
        added_money: 0,
        sort_order: 1
      },
    });      
    event = await prisma.event.upsert({
      where: {
        id: "evt_dadfd0e9c11a4aacb87084f1609a0afd",
      },
      update: {},
      create: {
        id: "evt_dadfd0e9c11a4aacb87084f1609a0afd",
        tmnt_id: "tmt_56d916ece6b50e6293300248c6792316",
        event_name: "Singles",
        team_size: 1,
        games: 6,
        entry_fee: 60,
        lineage: 15,
        prize_fund: 45,
        other: 0,
        expenses: 0,
        added_money: 0,
        sort_order: 1
      },
    });  
    event = await prisma.event.upsert({
      where: {
        id: "evt_06055deb80674bd592a357a4716d8ef2",
      },
      update: {},
      create: {
        id: "evt_06055deb80674bd592a357a4716d8ef2",
        tmnt_id: "tmt_d9b1af944d4941f65b2d2d4ac160cdea",
        event_name: "Singles",
        team_size: 1,
        games: 5,
        entry_fee: 70,
        lineage: 15,
        prize_fund: 50,
        other: 0,
        expenses: 5,
        added_money: 0,
        sort_order: 1
      },
    });  
    event = await prisma.event.upsert({
      where: {
        id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
      },
      update: {},
      create: {
        id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
        tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
        event_name: "Singles",
        team_size: 1,
        games: 6,
        entry_fee: 80,
        lineage: 18,
        prize_fund: 57,
        other: 0,
        expenses: 5,
        added_money: 0,
        sort_order: 1
      },
    });  
    console.log("Upserted events:", 4);
    return 4
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function divUpsert() { 
  try {
    let div = await prisma.div.upsert({
      where: {
        id: "div_f30aea2c534f4cfe87f4315531cef8ef",
      },
      update: {},
      create: {
        id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        event_id: "evt_cb97b73cb538418ab993fc867f860510",
        div_name: "Scratch",
        hdcp_per: 0,        
        sort_order: 1
      },
    });      
    div = await prisma.div.upsert({
      where: {
        id: "div_26230803eb454a6588476b64eab1963a",
      },
      update: {},
      create: {
        id: "div_26230803eb454a6588476b64eab1963a",
        event_id: "evt_cb97b73cb538418ab993fc867f860510",
        div_name: "50+ Scratch",
        hdcp_per: 0,        
        sort_order: 2
      },
    });      
    div = await prisma.div.upsert({
      where: {
        id: "div_1f42042f9ef24029a0a2d48cc276a087",
      },
      update: {},
      create: {
        id: "div_1f42042f9ef24029a0a2d48cc276a087",
        event_id: "evt_dadfd0e9c11a4aacb87084f1609a0afd",
        div_name: "Scratch",
        hdcp_per: 0,
        sort_order: 1
      },
    });      
    div = await prisma.div.upsert({
      where: {
        id: "div_578834e04e5e4885bbae79229d8b96e8",
      },
      update: {},
      create: {
        id: "div_578834e04e5e4885bbae79229d8b96e8",
        event_id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
        div_name: "Scratch",
        hdcp_per: 0,
        sort_order: 1
      },
    });      
    div = await prisma.div.upsert({
      where: {
        id: "div_24b1cd5dee0542038a1244fc2978e862",
      },
      update: {},
      create: {
        id: "div_24b1cd5dee0542038a1244fc2978e862",
        event_id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
        div_name: "Hdcp",
        hdcp_per: 90,
        sort_order: 2
      },
    });      
    div = await prisma.div.upsert({
      where: {
        id: "div_fe72ab97edf8407186c8e6df7f7fb741",
      },
      update: {},
      create: {
        id: "div_fe72ab97edf8407186c8e6df7f7fb741",
        event_id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
        div_name: "Hdcp 50+",
        hdcp_per: 90,
        sort_order: 3
      },
    });      
    console.log("Upserted divs:", 6);
    return 6
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function hdcpUpsert() { 
  try {
    let hdcp = await prisma.hdcp.upsert({
      where: {
        id: "hdc_67c7a51bbd2d441da9bb20a3001795a9",
      },
      update: {},
      create: {
        id: "hdc_67c7a51bbd2d441da9bb20a3001795a9",
        div_id: "div_24b1cd5dee0542038a1244fc2978e862",
        hdcp_from: 220,
        int_hdcp: true,
        game: true
      },
    }); 
    hdcp = await prisma.hdcp.upsert({
      where: {
        id: "hdc_d97abb6a776f4ab289d9e913ea7ada46",
      },
      update: {},
      create: {
        id: "hdc_d97abb6a776f4ab289d9e913ea7ada46",
        div_id: "div_fe72ab97edf8407186c8e6df7f7fb741",
        hdcp_from: 220,
        int_hdcp: true,
        game: true
      },
    }); 
    console.log("Upserted hdcps:", 2);
    return 2
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function squadUpsert() { 
  try {
    let squad = await prisma.squad.upsert({
      where: {
        id: "sqd_7116ce5f80164830830a7157eb093396",
      },
      update: {},
      create: {
        id: "sqd_7116ce5f80164830830a7157eb093396",
        event_id: "evt_cb97b73cb538418ab993fc867f860510",
        squad_name: "Squad 1",
        squad_date: new Date("10/23/2022"),
        squad_time: null,
        games: 6,
        sort_order: 1
      },
    });      
    squad = await prisma.squad.upsert({
      where: {
        id: "sqd_1a6c885ee19a49489960389193e8f819",
      },
      update: {},
      create: {
        id: "sqd_1a6c885ee19a49489960389193e8f819",
        event_id: "evt_dadfd0e9c11a4aacb87084f1609a0afd",
        squad_name: "Squad 1",
        squad_date: new Date("01/02/2023"),
        squad_time: null,
        games: 6,
        sort_order: 1
      },
    });      
    console.log("Upserted squads:", 2);
    return 2
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function potsUpsert() {

  try {
    let pot = await prisma.pot.upsert({
      where: {
        id: "pot_b2a7b02d761b4f5ab5438be84f642c3b",
      },
      update: {},
      create: {
        id: "pot_b2a7b02d761b4f5ab5438be84f642c3b",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 1,
        fee: 20,
        pot_type: 'Game',
      },
    });      
    pot = await prisma.pot.upsert({
      where: {
        id: "pot_ef6e06e06abb4d96a47017553f9a5e9e",
      },
      update: {},
      create: {
        id: "pot_ef6e06e06abb4d96a47017553f9a5e9e",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 2,
        fee: 10,
        pot_type: 'Last_Game',
      },
    });  
    pot = await prisma.pot.upsert({
      where: {
        id: "pot_ef6e06e06abb4d96a47017553f9a5e9e",
      },
      update: {},
      create: {
        id: "pot_ef6e06e06abb4d96a47017553f9a5e9e",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 2,
        fee: 10,
        pot_type: 'Last_Game',
      },
    });  
    pot = await prisma.pot.upsert({
      where: {
        id: "pot_ef6e06e06abb4d96a47017553f9a5e9e",
      },
      update: {},
      create: {
        id: "pot_ef6e06e06abb4d96a47017553f9a5e9e",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_26230803eb454a6588476b64eab1963a",
        sort_order: 3,
        fee: 20,
        pot_type: 'Game',
      },
    });  
    pot = await prisma.pot.upsert({
      where: {
        id: "pot_dd99ba49394f4837aef26ec7e5781137",
      },
      update: {},
      create: {
        id: "pot_dd99ba49394f4837aef26ec7e5781137",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_26230803eb454a6588476b64eab1963a",
        sort_order: 4,
        fee: 10,
        pot_type: 'Series',
      },
    });  
    pot = await prisma.pot.upsert({
      where: {
        id: "pot_98b3a008619b43e493abf17d9f462a65",
      },
      update: {},
      create: {
        id: "pot_98b3a008619b43e493abf17d9f462a65",
        squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
        div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
        sort_order: 1,
        fee: 10,
        pot_type: 'Game',
      },
    });  
    pot = await prisma.pot.upsert({
      where: {
        id: "pot_ab80213899ea424b938f52a062deacfe",
      },
      update: {},
      create: {
        id: "pot_ab80213899ea424b938f52a062deacfe",
        squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
        div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
        sort_order: 2,
        fee: 10,
        pot_type: 'Last Gane',
      },
    });  

    console.log("Upserted pots:", 6);
    return 6
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function brktUpsert() {

  try {
    let brkt = await prisma.bracket.upsert({
      where: {
        id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
      },
      update: {},
      create: {
        id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 1,
        start: 1,
        games: 3,
        players: 8,
        fee: 5,
        first: 25,
        second: 10,
        admin: 5,
      },
    });      
    brkt = await prisma.bracket.upsert({
      where: {
        id: "brk_6ede2512c7d4409ca7b055505990a499",
      },
      update: {},
      create: {
        id: "brk_6ede2512c7d4409ca7b055505990a499",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 2,
        start: 4,
        games: 3,
        players: 8,
        fee: 5,
        first: 25,
        second: 10,
        admin: 5,
      },
    });      
    brkt = await prisma.bracket.upsert({
      where: {
        id: "brk_aa3da3a411b346879307831b6fdadd5f",
      },
      update: {},
      create: {
        id: "brk_aa3da3a411b346879307831b6fdadd5f",
        squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
        div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
        sort_order: 1,
        start: 1,
        games: 3,
        players: 8,
        fee: 5,
        first: 25,
        second: 10,
        admin: 5,
      },
    });      
    brkt = await prisma.bracket.upsert({
      where: {
        id: "brk_37345eb6049946ad83feb9fdbb43a307",
      },
      update: {},
      create: {
        id: "brk_37345eb6049946ad83feb9fdbb43a307",
        squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
        div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
        sort_order: 2,
        start: 4,
        games: 3,
        players: 8,
        fee: 5,
        first: 25,
        second: 10,
        admin: 5,
      },
    });      

    console.log("Upserted brackets:", 4);
    return 4
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function elimUpsert() {

  try {
    let elim = await prisma.eliminator.upsert({
      where: {
        id: "elm_45d884582e7042bb95b4818ccdd9974c",
      },
      update: {},
      create: {
        id: "elm_45d884582e7042bb95b4818ccdd9974c",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 1,
        start: 1,
        games: 3,
        fee: 5,
      },
    });      
    elim = await prisma.eliminator.upsert({
      where: {
        id: "elm_9d01015272b54962a375cf3c91007a12",
      },
      update: {},
      create: {
        id: "elm_9d01015272b54962a375cf3c91007a12",
        squad_id: "sqd_7116ce5f80164830830a7157eb093396",
        div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
        sort_order: 2,
        start: 4,
        games: 3,
        fee: 5,
      },
    });      
    elim = await prisma.eliminator.upsert({
      where: {
        id: "brk_aa3da3a411b346879307831b6fdadd5f",
      },
      update: {},
      create: {
        id: "brk_aa3da3a411b346879307831b6fdadd5f",
        squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
        div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
        sort_order: 1,
        start: 1,
        games: 3,
        fee: 5,
      },
    });      
    elim = await prisma.eliminator.upsert({
      where: {
        id: "brk_37345eb6049946ad83feb9fdbb43a307",
      },
      update: {},
      create: {
        id: "brk_37345eb6049946ad83feb9fdbb43a307",
        squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
        div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
        sort_order: 2,
        start: 4,
        games: 3,
        fee: 5,
      },
    });      

    console.log("Upserted eliminators:", 4);
    return 4
  } catch (error) {
    console.log(error)
    return -1
  }
}

async function main() {
  
  let count = await userUpsert();
  if (count < 0) return;

  count = await bowlUpsert();
  if (count < 0) return;

  count = await tmntUpsert();
  if (count < 0) return;

  count = await eventUpsert();
  if (count < 0) return;

  count = await divUpsert();
  if (count < 0) return;

  count = await hdcpUpsert()
  if (count < 0) return;

  count = await squadUpsert();
  if (count < 0) return;

  count = await potsUpsert();
  if (count < 0) return;

  count = await brktUpsert();
  if (count < 0) return;

  count = await elimUpsert();
  if (count < 0) return;
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
