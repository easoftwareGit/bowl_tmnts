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
  allDataOneTmntType,
} from "../types/types";
import { User, Bowl, Tmnt } from "@prisma/client";
import { todayStr } from "@/lib/dateTools";
import { btDbUuid } from "../uuid";
import { startOfToday } from "date-fns";

export const initUser: userType = {
  id: btDbUuid('usr'),
  email: "",  
  password: "",
  password_hash: "",
  first_name: "",
  last_name: "",
  phone: "",
  role: 'USER'
}

export const blankUser = {
  ...initUser,
  id: "",
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
  id: btDbUuid('bwl'),  
  bowl_name: "",
  city: "",
  state: "",
  url: "",
}

export const blankBowl = {
  ...initBowl,
  id: "",
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
  id: btDbUuid('tmt'),
  user_id: "",
  tmnt_name: "",
  tmnt_name_err: "",
  bowl_id: "",
  bowl_id_err: "",
  start_date: startOfToday(),
  start_date_err: "",
  end_date: startOfToday(),
  end_date_err: "",
  bowls: {
    bowl_name: "",
    city: "",
    state: "",
    url: "",
  },
};

export const blankTmnt = {
  ...initTmnt,
  id: '',
  start_date: startOfToday(),
  end_date: startOfToday(),
}

export const blankAllDataOneTmnt: allDataOneTmntType = {  
  tmnt: { ...blankTmnt },
  events: [],
  divs: [],
  squads: [],
  lanes: [],
  pots: [],
  brkts: [],
  elims: [],
}

export const initPrismaTmnt: Tmnt = {
  id: "",
  user_id: "",
  tmnt_name: "",  
  bowl_id: "",  
  start_date: startOfToday(),
  end_date: startOfToday(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const initEvent: eventType = {
  id: btDbUuid('evt'),  
  tmnt_id: "",
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
  sort_order: 1,
};

export const blankEvent: eventType = {
  ...initEvent,
  id: "",
  tmnt_id: "",
  event_name: "",
  tab_title: "",  
};

export const defaultHdcpPer = 1.0;
export const defaultHdcpFrom = 230;
export const initDiv: divType = {
  id: btDbUuid('div'),
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
  errClassName: "",
  sort_order: 1,
};

export const blankDiv: divType = {
  ...initDiv,
  id: "",
  tmnt_id: "",
  div_name: "",
  tab_title: "",
};

export const defaultStartingLane = 1;
export const defaultLaneCount = 2;
export const initSquad: squadType = {
  id: btDbUuid('sqd'),
  event_id: "",
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
  squad_date: startOfToday(),
  squad_date_str: todayStr,
  squad_date_err: "",
  squad_time: "",
  squad_time_err: "",
  sort_order: 1,
  errClassName: "",
};

export const blankSquad: squadType = {
  ...initSquad,
  id: "",
  event_id: "",
  squad_date: null as any,
  squad_name: "",
  tab_title: "",
};

export const initLane: laneType = {
  id: btDbUuid('lan'),
  squad_id: "",
  lane_number: 1,
  in_use: true,
};

export const blankLane: laneType = {
  ...initLane,
  id: "",
  squad_id: "",
};

export const initPot: potType = {
  id: btDbUuid('pot'),
  div_id: "",
  squad_id: "",
  pot_type: "",
  pot_type_err: "",  
  div_err: "",
  fee: "",
  fee_err: "",
  sort_order: 1,
  errClassName: "",
};

export const blankPot: potType = {
  ...initPot,
  id: "",
}

export const defaultBrktGames = 3;
export const defaultBrktPlayers = 8;
export const initBrkt: brktType = {
  id: btDbUuid('brk'),
  div_id: "",
  squad_id: "",  
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

export const blankBrkt: brktType = {
  ...initBrkt,
  id: "",
}

export const defaultElimGames = 3;
export const initElim: elimType = {
  id: btDbUuid('elm'),
  div_id: "",
  squad_id: "",  
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

export const blankElim: elimType = {
  ...initElim,
  id: "",
}

export const initEvents: eventType[] = [
  {
    ...initEvent,
    id: btDbUuid('evt'),
  },
];

export const initDivs: divType[] = [
  {
    ...initDiv,
    id: btDbUuid('div'),
  },
];

export const initSquads: squadType[] = [
  {
    ...initSquad,
    id: btDbUuid('sqd'),
  },
];

export const initLanes: laneType[] = [
  {
    id: btDbUuid('lan'),    
    lane_number: 1,
    squad_id: "",
    in_use: true,
  },
  {
    id: btDbUuid('lan'),
    lane_number: 2,
    squad_id: "",
    in_use: true,
  },
];

export const initPots: potType[] = [];

export const initBrkts: brktType[] = [];

export const initElims: elimType[] = [];

export const initTestDate: testDateType = {
  id: 0,
  sod: new Date(Date.UTC(2000, 0, 1)),
  eod: new Date(Date.UTC(2000, 0, 1, 23, 59, 59, 999)),
  gmt: new Date(Date.UTC(2000, 0, 1, 1, 2, 3, 0))        
}
