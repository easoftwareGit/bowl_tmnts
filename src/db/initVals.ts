import {
  userType,
  bowlType,
  tmntType,  
  eventType,
  divType,
  squadType,
  laneType,
  elimType,
  brktType,
  potType,  
  testDateType,
} from "../lib/types/types";
import { User, Bowl, Tmnt } from "@prisma/client";
import { startOfDayFromString, startOfTodayUTC, todayStr } from "@/lib/dateTools";

export const initUser: userType = {
  id: "1",  
  email: "",  
  password: "",
  password_hash: "",
  first_name: "",
  last_name: "",
  phone: "",
  role: 'USER'
}

export const initPrismaUser: User = {
  id: "",  
  email: "",  
  password_hash: "",  
  first_name: "",
  last_name: "",
  phone: "",
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const initBowl: bowlType = {
  id: "1",
  bowl_name: "",
  city: "",
  state: "",
  url: "",
}

export const initPrismaBowl: Bowl = {
  id: "",
  bowl_name: "",
  city: "",
  state: "",
  url: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const initTmnt: tmntType = {
  id: "1",
  user_id: "",
  tmnt_name: "",
  tmnt_name_err: "",
  bowl_id: "",
  bowl_id_err: "",
  start_date: startOfDayFromString(todayStr) as Date,     
  start_date_err: "",
  end_date: startOfDayFromString(todayStr) as Date,    
  end_date_err: "",
  bowls: {
    bowl_name: "",
    city: "",
    state: "",
    url: "",
  },
};

export const initPrismaTmnt: Tmnt = {
  id: "",
  user_id: "",
  tmnt_name: "",  
  bowl_id: "",  
  start_date: startOfDayFromString(todayStr) as Date,  
  end_date: startOfDayFromString(todayStr) as Date,    
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const initEvent: eventType = {
  id: "1",
  sort_order: 1,
  tmnt_id: "1",
  tab_title: "Singles",
  event_name: "Singles",
  event_name_err: "",
  team_size: 1,
  team_size_err: "",
  games: 3,
  games_err: "",
  entry_fee: "",
  entry_fee_err: "",
  lineage: "",
  lineage_err: "",
  prize_fund: "",
  prize_fund_err: "",
  other: "",
  other_err: "",
  expenses: "",
  expenses_err: "",
  added_money: "",
  added_money_err: "",
  lpox: "",
  lpox_valid: "",
  lpox_err: "",
  errClassName: "",
};

export const defaultHdcpPer = 1.0;
export const defaultHdcpFrom = 230;
export const initDiv: divType = {
  id: "1",
  tmnt_id: "1",
  div_name: "Division 1",
  div_name_err: "",
  tab_title: "Division 1",
  hdcp_per: defaultHdcpPer,
  hdcp_per_str: (defaultHdcpPer * 100).toFixed(2),
  hdcp_per_err: "",
  hdcp_from: defaultHdcpFrom,
  hdcp_from_err: "",
  int_hdcp: true,
  hdcp_for: "Game",
  sort_order: 1,
  errClassName: "",
};

export const defaultStartingLane = 1;
export const defaultLaneCount = 2;
export const initSquad: squadType = {
  id: "1",
  event_id: "1",
  event_id_err: "",
  tab_title: "Squad 1",
  squad_name: "Squad 1",
  squad_name_err: "",
  games: 3,
  games_err: "",
  starting_lane: defaultStartingLane,
  starting_lane_err: "",
  lane_count: defaultLaneCount,
  lane_count_err: "",
  squad_date: startOfDayFromString(todayStr) as Date,  
  squad_date_str: todayStr,
  squad_date_err: "",
  squad_time: "",
  squad_time_err: "",
  sort_order: 1,
  errClassName: "",
};

export const initLane: laneType = {
  id: "1",
  squad_id: "1",
  lane_number: 1,
};

export const initPot: potType = {
  id: "1",
  div_id: "",
  squad_id: "",
  pot_type: "",
  pot_type_err: "",
  div_name: "",
  div_err: "",
  fee: "",
  fee_err: "",
  sort_order: 1,
  errClassName: "",
};

export const defaultBrktGames = 3;
export const defaultBrktPlayers = 8;
export const initBrkt: brktType = {
  id: "1",
  div_id: "",
  squad_id: "",
  div_name: "",
  div_err: "",
  start: 1,
  start_err: "",
  games: defaultBrktGames,
  games_err: "",
  players: defaultBrktPlayers,
  players_err: "",
  fee: "",
  fee_err: "",
  first: "",
  first_err: "",
  second: "",
  second_err: "",
  admin: "",
  admin_err: "",
  fsa: "",
  fsa_valid: "",
  fsa_err: "",
  sort_order: 1,
  errClassName: "",
};

export const defaultElimGames = 3;
export const initElim: elimType = {
  id: "1",
  div_id: "",
  squad_id: "",
  div_name: "",
  div_err: "",
  fee: "",
  fee_err: "",
  start: 1,
  start_err: "",
  games: defaultElimGames,
  games_err: "",
  sort_order: 1,
  errClassName: "",
};

export const initEvents: eventType[] = [
  {
    ...initEvent,
  },
];

export const initDivs: divType[] = [
  {
    ...initDiv,
  },
];

export const initSquads: squadType[] = [
  {
    ...initSquad,
  },
];

export const initLanes: laneType[] = [
  {
    id: "1",
    lane_number: 1,
    squad_id: "1",
  },
  {
    id: "2",
    lane_number: 2,
    squad_id: "1",
  },
];

export const initPots: potType[] = [
  {
    ...initPot,
  },
];

export const initBrkts: brktType[] = [
  {
    ...initBrkt,
  },
];

export const initElims: elimType[] = [
  {
    ...initElim,
  },
];

export const initTestDate: testDateType = {
  id: 0,
  sod: new Date(Date.UTC(2000, 0, 1)),
  eod: new Date(Date.UTC(2000, 0, 1, 23, 59, 59, 999)),
  gmt: new Date(Date.UTC(2000, 0, 1, 1, 2, 3, 0))        
}
