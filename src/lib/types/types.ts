export type roleTypes = "ADMIN" | "DIRECTOR" | "USER"

export type idTypes = 'usr' | 'bwl' | 'tmt' | 'evt' | 'div' | 'sqd' | 'lan' | 'hdc' | 'pot' | 'brk' | 'elm' | 'ply'

export type saveTypes = "POST" | "PUT"

export type userType = {
  id: string
  email: string
  password: string
  password_hash: string
  first_name: string
  last_name: string
  phone: string
  role: roleTypes
}

export type bowlType = {
  id: string,
  bowl_name: string,  
  city: string,
  state: string,
  url: string
}

export type YearObj = {
  year: string,
}

export type BowlInTmntData = {  
  bowl_name: string;
  city: string;
  state: string;
  url: string;
}

export type tmntListType = {
  id: string; 
	tmnt_name: string; 
	start_date: Date; 
	bowls: BowlInTmntData,
}

export type tmntType = {
  id: string,
  user_id: string,
  tmnt_name: string,
  tmnt_name_err: string,
  bowl_id: string,
  bowls: BowlInTmntData
  bowl_id_err: string,
  start_date: Date,  
  start_date_err: string,
  end_date: Date,
  end_date_err: string,
}

export type lpoxValidTypes = "is-valid" | "is-invalid" | "";

export type eventType = {
  id: string,
  tmnt_id: string,
  tab_title: string,
  event_name: string,
  event_name_err: string,
  team_size: number,
  team_size_err: string,
  games: number,
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
  lpox_valid: lpoxValidTypes,
  lpox_err: string,
  sort_order: number,
  errClassName: string,  
}

// NO lpox in eventDataType
export type eventDataType = {
  tmnt_id: string,
  event_name: string,
  team_size: number,
  games: number,
  entry_fee: string,
  lineage: string,
  prize_fund: string,
  other: string,
  expenses: string,
  added_money: string,      
  sort_order: number,
  id?: string
}

export type HdcpForTypes = "Game" | "Series";

export type divType = {
  id: string,
  tmnt_id: string,
  div_name: string,
  div_name_err: string,
  tab_title: string,
  hdcp_per: number,
  hdcp_per_str: string,
  hdcp_per_err: string,
  hdcp_from: number,
  hdcp_from_err: string,
  int_hdcp: boolean,
  hdcp_for: HdcpForTypes,
  sort_order: number,
  errClassName: string,
}

export type squadType = {
  id: string,
  event_id: string,  
  event_id_err: string,
  tab_title: string,
  squad_name: string,
  squad_name_err: string,  
  games: number,  
  games_err: string,
  lane_count: number,
  lane_count_err: string,
  starting_lane: number,
  starting_lane_err: string,
  squad_date: Date,
  squad_date_str: string,
  squad_date_err: string,
  squad_time: string | null,
  squad_time_err: string,
  sort_order: number,
  errClassName: string,  
}
  
export type laneType = {  
  id: string,
  lane_number: number,
  squad_id: string,  
}

export type pairsOfLanesType = {
  left_id: string,
  left_lane: number,
  right_id: string,
  right_lane: number,
  in_use: boolean,
}

export type PotCategories = "Game" | "Last Game" | "Series" | "";

export type PotCategoryObjType = {
  id: number,
  name: PotCategories,  
}

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
  sort_order: number,
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
  sort_order: number,
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
  sort_order: number,
  errClassName: string,
}

export type AcdnErrType = {
  errClassName: string,
  message: string,
}

export type fullTmntDataType = {
  tmnt: tmntType;
  events: eventType[];
  divs: divType[];
  squads: squadType[];
  lanes: laneType[];
  pots: potType[];
  brkts: brktType[];
  elims: elimType[];
}

export type tmntPropsType = {
  tmnt: tmntType;
  setTmnt: (tmnt: tmntType) => void;
  events: eventType[];
  setEvents: (events: eventType[]) => void;
  divs: divType[];
  setDivs: (divs: divType[]) => void;
  squads: squadType[];
  setSquads: (squads: squadType[]) => void;
  lanes: laneType[];
  setLanes: (lanes: laneType[]) => void;
  pots: potType[];
  setPots: (pots: potType[]) => void;
  elims: elimType[];
  setElims: (elims: elimType[]) => void;
  brkts: brktType[];
  setBrkts: (brkts: brktType[]) => void;
}

export type testDateType = {
  id: number,
  sod: Date,
  eod: Date,
  gmt: Date,
}

