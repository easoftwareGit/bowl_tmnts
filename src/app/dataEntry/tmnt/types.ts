export type eventType = {
  id: number,
  name: string,
  tabTitle: string,
  team_size: number,
  games: number,
  name_err: string,
  team_size_err: string,
  games_err: string
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
}

export type squadType = {
  id: number,
  name: string,
  tabTitle: string,
  sqd_date: string,
  sqd_time: string,
  games: number,  
  name_err: string,
  sqd_date_err: string,
  sqd_time_err: string,
  games_err: string,
}

