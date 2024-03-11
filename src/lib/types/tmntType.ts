export type YearObj = {
  year: number,
}

export type BowlInTmntData = {  
  bowl_name: string;
  city: string;
  state: string;
  url: string;
}

export type TmntDataType = {
  id: string,
  tmnt_name: string,
  start_date: Date,
  bowls: BowlInTmntData
}