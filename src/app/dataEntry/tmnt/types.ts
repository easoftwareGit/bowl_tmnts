import { Feat } from "@prisma/client"
import { SetStateAction } from "react"
import { Dispatch } from "redux"

export type eventType = {
  id: number,
  name: string,
  tabTitle: string,
  team_size: number,
  games: number,
  name_err: string,
  team_size_err: string,
  games_err: string,
  entry_fee: string,
  entry_fee_err: string,
  lineage: string,
  lineage_err: string,
  prize_fund: string,
  prize_fund_err: string,
  other: string,
  other_err: string,
  expenses: string,
  expenses_err: string,
  added_money: string,
  added_money_err: string,
  lpox: string,
  lpox_valid: string,
  lpox_err: string,
  errClassName: string,
}

export type divType = {
  id: number,
  name: string,
  tabTitle: string,
  hdcp: number,
  hdcp_from: number,
  int_hdcp: boolean,
  hdcp_for: string,
  name_err: string,
  hdcp_err: string,
  hdcp_from_err: string,
  errClassName: string,
}

export type squadType = {
  id: number,
  event_id: number,  
  event_id_err: string,
  name: string,
  tabTitle: string,
  squad_date: string,
  squad_time: string,
  games: number,  
  name_err: string,
  squad_date_err: string,
  squad_time_err: string,
  games_err: string,
  errClassName: string,
}

export type divFeatType = {
  id: string,
  div_id: string,
  feat_id: string,
  feat_name: string,
  sort_order: number,
  entry_type: string,
  errClassName: string,
}

export type divFeatErrType = {
  sort_order: number,
  errClassName: string
}

export type seDivFeatType = {
  id: string,
  div_feat_id: string,
  feat_name: string,
  sort_order: number,
  fee: string,
  fee_err: string,
}

export type elimType = {
  id: string,
  div_feat_id: string,
  start: string,
  start_err: string,
  games: number,
  games_err: string,
  fee: string,
  fee_err: string,
}

export type brktType = {
  id: string,
  div_feat_id: string,  
  start: string,
  start_err: string,
  games: number,
  games_err: string,
  players: number,
  players_err: string,
  fee: string,
  fee_err: string,
  first: string,
  first_err: string,
  second: string,
  second_err: string,
  admin: string,
  admin_err: string,
  fsa: string,
  fsa_valid: string,
  fsa_err: string,
}

export type featsParamsType = {
  divFeats: divFeatType[];
  setDivFeats: (divFeats: divFeatType[]) => void;
  seDivFeats: seDivFeatType[];
  setSeDivFeats: (seDivFeats: seDivFeatType[]) => void;
  elim: elimType;
  setElim: (elDivFeat: elimType) => void;
  brkt: brktType;
  setBrkt: (brDivfeat: brktType) => void;
  featAcdnErr: AcdnErrType;
  setFeatAcdnErr: (objAcdnErr: AcdnErrType) => void;
}

export type AcdnErrType = {
  errClassName: string,
  message: string,
}

