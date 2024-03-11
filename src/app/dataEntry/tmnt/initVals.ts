import { eventType, divType, squadType, elimType, brktType } from "./types";
import { todayStr } from "@/lib/dateTools";

export const initEvent: eventType = {
  id: 1,
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
  id: 1,
  name: "Division 1",
  tabTitle: "Division 1",
  hdcp: 90,
  hdcp_from: 220,
  int_hdcp: true,
  hdcp_for: "game",
  name_err: "",
  hdcp_err: "",
  hdcp_from_err: "",
  errClassName: "",
}

export const initSquad: squadType = {
  id: 1,
  event_id: 1,  
  event_id_err: '',
  name: "Squad 1",
  tabTitle: "Squad 1",
  squad_date: todayStr,
  squad_time: "",
  games: 3,
  name_err: "",
  squad_date_err: "",
  squad_time_err: "",
  games_err: "",
  errClassName: "",
}

export const defaultElimGames = 3;

export const initElim: elimType = {
  id: '',
  div_feat_id: '',
  fee: '',
  fee_err: '',
  start: '',
  start_err: '',
  games: defaultElimGames,
  games_err: '',  
}

export const defaultBrktGames = 3;
export const defaultBrktPlayers = 8;

export const initBrkt: brktType = {
  id: '',
  div_feat_id: '',  
  start: '',
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
}