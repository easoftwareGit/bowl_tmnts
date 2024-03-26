import { eventType, divType, squadType, elimType, brktType, potType } from "./types";
import { todayStr } from "@/lib/dateTools";

export const initEvent: eventType = {
  id: "1",
  sort_order: 1, 
  tmnt_id: '',
  tab_title: "Singles",
  event_name: "Singles",
  event_name_err: '',
  team_size: 1,
  team_size_err: '',
  games: 3,
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
  event_id: "1",
  div_name: "Division 1",  
  div_name_err: "",
  tab_title: "Division 1",
  hdcp: 100,
  hdcp_err: "",
  hdcp_from: 230,
  hdcp_from_err: "",
  int_hdcp: true,
  hdcp_for: "Game",  
  sort_order: 1,
  errClassName: "",
}

export const initSquad: squadType = {
  id: "1",
  event_id: "1",  
  event_id_err: '',
  tab_title: "Squad 1",
  squad_name: "Squad 1",
  squad_name_err: "",
  games: 3,  
  games_err: "",
  squad_date: todayStr,
  squad_date_err: "",
  squad_time: "",
  squad_time_err: "",
  sort_order: 1,
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
  sort_order: 1,
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
  sort_order: 1,
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
  sort_order: 1,
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