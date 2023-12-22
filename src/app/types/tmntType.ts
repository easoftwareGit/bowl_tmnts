import { Bowl } from "@prisma/client"

export type FullTmnt = {
  id: string,
  user_id: string,
  tmnt_name: string,
  bowl_id: string
  bowls: Bowl 
  start_date: Date,
  end_date: Date,
  createdAt: Date,
  updatedAt: Date
}

export type TmntsFromStateObj = {
  tmntData: FullTmnt[];
}