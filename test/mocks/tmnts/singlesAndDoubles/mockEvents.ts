import { initEvent } from "@/lib/db/initVals";
import { eventType } from "@/lib/types/types";
import { Event } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const mockEvents: eventType[] = [
  {
    id: "evt_6ff6774e94884658be5bdebc68a6aa7c",
    tmnt_id: "tmt_e4b8f102381e4565a609511b0cb453c0",
    tab_title: "Singles",
    event_name: "Singles",
    event_name_err: '',
    team_size: 1,
    team_size_err: '',
    games: 3,
    games_err: '',
    entry_fee: '30',
    entry_fee_err: '',
    lineage: '9',
    lineage_err: '',
    prize_fund: '20',
    prize_fund_err: '',
    other: '0',
    other_err: '',
    expenses: '1',
    expenses_err: '',
    added_money: '0',
    added_money_err: '',
    lpox: '30',
    lpox_valid: 'is-valid',
    lpox_err: '',
    sort_order: 1,
    errClassName: "",
  },
  {
    id: "evt_20235232fd444241ace86e6e58b01ad8",
    tmnt_id: "tmt_e4b8f102381e4565a609511b0cb453c0",
    tab_title: "Doubles",
    event_name: "Doubles",
    event_name_err: '',
    team_size: 2,
    team_size_err: '',
    games: 4,
    games_err: '',
    entry_fee: '90',
    entry_fee_err: '',
    lineage: '24',
    lineage_err: '',
    prize_fund: '61',
    prize_fund_err: '',
    other: '2',
    other_err: '',
    expenses: '3',
    expenses_err: '',
    added_money: '100',
    added_money_err: '',
    lpox: '90',
    lpox_valid: 'is-valid',
    lpox_err: '',
    sort_order: 2,
    errClassName: "",
  },
]

export const mockEventsToEdit: eventType[] = [
  {
    ...initEvent,
    id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    event_name: "Singles",
    team_size: 1,
    games: 6,
    entry_fee: '80',
    lineage: '18',
    prize_fund: '55',
    other: '2',
    expenses: '5',
    added_money: '0',    
    lpox: '80',
    sort_order: 1,
  },
  { 
    ...initEvent,
    id: "evt_cb55703a8a084acb86306e2944320e8d",
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    event_name: "Doubles",
    team_size: 2,
    games: 6,
    entry_fee: '160',
    lineage: '36',
    prize_fund: '110',
    other: '4',
    expenses: '10',
    added_money: '0',
    lpox: '160',
    sort_order: 2,      
  }, 
  {
    ...initEvent,
    id: "evt_adfcff4846474a25ad2936aca121bd37",
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    event_name: "Trios",
    team_size: 3,
    games: 3,
    entry_fee: '160',
    lineage: '36',
    prize_fund: '110',
    other: '4',
    expenses: '10',
    added_money: '0',
    lpox: '160',
    sort_order: 3,
  }
]

// id of tmnt to delete in prisma/seeds.ts
export const tmntToDelId = 'tmt_e134ac14c5234d708d26037ae812ac33'
export const mockEventsToPost: eventType[] = [
  {
    ...initEvent,
    id: "evt_9a58f0a486cb4e6c92ca3348702b1a63", // changed last digit to make unique
    tmnt_id: tmntToDelId,
    event_name: "Test 1",
    tab_title: "Test 1",
    team_size: 1,
    games: 6,
    entry_fee: '80',
    lineage: '18',
    prize_fund: '55',
    other: '2',
    expenses: '5',
    added_money: '0',    
    lpox: '80',
    sort_order: 11,
  },
  { 
    ...initEvent,
    id: "evt_cb55703a8a084acb86306e2944320e8e", // changed last digit to make unique
    tmnt_id: tmntToDelId,
    event_name: "Test 2",
    tab_title: "Test 2",
    team_size: 2,
    games: 6,
    entry_fee: '160',
    lineage: '36',
    prize_fund: '110',
    other: '4',
    expenses: '10',
    added_money: '0',
    lpox: '160',
    sort_order: 12,      
  }
]

export const mockManyPrismaEvents: Event[] = [
  {    
    id: "evt_9a58f0a486cb4e6c92ca3348702b1a63", // changed last digit to make unique
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    event_name: "Singles",
    team_size: 1,
    games: 6,
    entry_fee: new Decimal(80),
    lineage: new Decimal(18),
    prize_fund: new Decimal(55),
    other: new Decimal(2),
    expenses: new Decimal(5),
    added_money: new Decimal(0),
    sort_order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    ...initEvent,
    id: "evt_cb55703a8a084acb86306e2944320e8e", // changed last digit to make unique
    tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
    event_name: "Doubles",
    team_size: 2,
    games: 6,
    entry_fee: new Decimal(160),
    lineage: new Decimal(36),
    prize_fund: new Decimal(110),
    other: new Decimal(4),
    expenses: new Decimal(10),
    added_money: new Decimal(0),
    sort_order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]
