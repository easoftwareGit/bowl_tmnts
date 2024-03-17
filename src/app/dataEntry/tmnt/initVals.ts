import { eventType, divType, squadType, elimType, brktType, potType } from "./types";
import { todayStr } from "@/lib/dateTools";

export const initEvent: eventType = {
  id: "1",
  name: "Singles",
  tabTitle: "Singles",
  team_size: 1,
  games: 3,
  name_err: '',
  team_size_err: '',
  games_err: '',
  entry_fee: '',
  entry_fee_err: '',
  lineage: '',
  lineage_err: '',
  prize_fund: '',
  prize_fund_err: '',
  other: '',
  other_err: '',
  expenses: '',
  expenses_err: '',
  added_money: '',
  added_money_err: '',
  lpox: '',
  lpox_valid: '',
  lpox_err: '',
  errClassName: "",
};

export const initDiv: divType = {
  id: "1",
  name: "Division 1",
  tab_title: "Division 1",
  hdcp: 90,
  hdcp_from: 220,
  int_hdcp: true,
  hdcp_for: "game",
  name_err: "",
  hdcp_err: "",
  hdcp_from_err: "",
  errClassName: "",
  pot: false,
  brkt: false,
  elim: false
}

export const initSquad: squadType = {
  id: "1",
  event_id: "1",  
  event_id_err: '',
  name: "Squad 1",
  tab_title: "Squad 1",
  squad_date: todayStr,
  squad_time: "",
  games: 3,
  name_err: "",
  squad_date_err: "",
  squad_time_err: "",
  games_err: "",
  errClassName: "",
}

export const initPot: potType = {
  id: "1",   
  div_id: '',
  squad_id: '',
  pot_type: '',
  pot_type_err: '',  
  div_name: '',  
  div_err: '',
  fee: '',
  fee_err: '',  
  errClassName: ''
}

export const defaultBrktGames = 3;
export const defaultBrktPlayers = 8;
export const initBrkt: brktType = {
  id: "1",
  div_id: '',  
  squad_id: '',
  div_name: '',  
  div_err: '',
  start: 1,
  start_err: '',
  games: defaultBrktGames,
  games_err: '',
  players: defaultBrktPlayers,
  players_err: '',
  fee: '',
  fee_err: '',
  first: '',
  first_err: '',
  second: '',
  second_err: '',
  admin: '',
  admin_err: '',
  fsa: '',
  fsa_valid: '',
  fsa_err: '',
  errClassName: '',
}

export const defaultElimGames = 3;

export const initElim: elimType = {
  id: '1',
  div_id: '',  
  squad_id: '',
  div_name: '',  
  div_err: '',
  fee: '',
  fee_err: '',
  start: 1,
  start_err: '',
  games: defaultElimGames,
  games_err: '',  
  errClassName: '',
}


export const initEvents: eventType[] = [
  {
    ...initEvent,
  }
]

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

export const initPots: potType[] = [
  {
    ...initPot,
  }
]

export const initBrkts: brktType[] = [
  {
    ...initBrkt
  }
]

export const initElims: elimType[] = [
  {
    ...initElim
  }
]