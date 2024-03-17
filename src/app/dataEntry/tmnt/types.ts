export type eventType = {
  id: string,
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
  id: string,
  name: string,
  tab_title: string,
  hdcp: number,
  hdcp_from: number,
  int_hdcp: boolean,
  hdcp_for: string,
  name_err: string,
  hdcp_err: string,
  hdcp_from_err: string,
  errClassName: string,
  pot: boolean,
  brkt: boolean,
  elim: boolean
}

export type squadType = {
  id: string,
  event_id: string,  
  event_id_err: string,
  name: string,
  tab_title: string,
  squad_date: string,
  squad_time: string,
  games: number,  
  name_err: string,
  squad_date_err: string,
  squad_time_err: string,
  games_err: string,
  errClassName: string,
}

export type PotCategories = "Game" | "Last Game" | "Series" | "";

export type potType = {
  id: string,   
  div_id: string,  
  squad_id: string,
  pot_type: PotCategories,
  pot_type_err: string,  
  div_name: string,  
  div_err: string,
  fee: string,
  fee_err: string,
  errClassName: string,
}

export type brktType = {
  id: string,
  div_id: string,  
  squad_id: string,
  div_name: string,  
  div_err: string,
  start: number,  
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
  errClassName: string,
}

export type elimType = {
  id: string,
  div_id: string,  
  squad_id: string,
  div_name: string,  
  div_err: string,
  start: number,
  start_err: string,
  games: number,
  games_err: string,
  fee: string,
  fee_err: string,
  errClassName: string,
}

// export type featsParamsType = {
//   divFeats: divFeatType[];
//   setDivFeats: (divFeats: divFeatType[]) => void;
//   seDivFeats: seDivFeatType[];
//   setSeDivFeats: (seDivFeats: seDivFeatType[]) => void;
//   elim: elimType;
//   setElim: (elDivFeat: elimType) => void;
//   brkt: brktType;
//   setBrkt: (brDivfeat: brktType) => void;
//   featAcdnErr: AcdnErrType;
//   setFeatAcdnErr: (objAcdnErr: AcdnErrType) => void;
// }

export type AcdnErrType = {
  errClassName: string,
  message: string,
}

export type tmntParamsType = {
  events: eventType[];
  setEvents: (events: eventType[]) => void;
  divs: divType[];
  setDivs: (divs: divType[]) => void;
  squads: squadType[];
  setSquads: (squads: squadType[]) => void;
  pots: potType[];
  setPots: (pots: potType[]) => void;
  elims: elimType[];
  setElims: (elims: elimType[]) => void;
  brkts: brktType[];
  setBrkts: (brkts: brktType[]) => void;
  acdnErr: AcdnErrType;
  setAcdnErr: (objAcdnErr: AcdnErrType) => void;
}