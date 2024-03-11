import { Feat, Div_Feat } from "@prisma/client"

export interface featsWChecked extends Feat {
  checked: boolean;
}

export interface divFeatsType extends Div_Feat {
  errClassName: string;
}

