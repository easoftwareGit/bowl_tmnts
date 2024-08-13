import { startOfDayFromString, todayStr } from "@/lib/dateTools";
import { tmntType } from "@/lib/types/types";

export const mockSDTmnt: tmntType = {
  id: "tmt_e4b8f102381e4565a609511b0cb453c0",
  user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde", 
  tmnt_name: "Alameda County Singles & Doubles",
  tmnt_name_err: "",
  bowl_id: 'bwl_561540bd64974da9abdd97765fdb3659',
  bowl_id_err: "",
  start_date: startOfDayFromString(todayStr) as Date,
  start_date_err: "",
  end_date: startOfDayFromString(todayStr) as Date,
  end_date_err: "",
  bowls: {
    bowl_name: "Earl Anthony's Dublin Bowl",
    city: "Dublin",
    state: "CA",
    url: "https://www.earlanthonysdublinbowl.com/",
  },
}