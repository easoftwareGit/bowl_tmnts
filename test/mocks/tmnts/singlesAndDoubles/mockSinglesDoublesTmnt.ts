import { todayStr } from "@/lib/dateTools";
import { tmntType } from "@/lib/types/types";

export const mockSDTmnt: tmntType = {
  id: "tmt_e4b8f102381e4565a609511b0cb453c0",
  tmnt_name: "Alameda County Singles & Doubles",
  tmnt_name_err: "",
  bowl_id: 'bwl_561540bd64974da9abdd97765fdb3659',
  bowl_id_err: "",
  start_date: todayStr,
  start_date_err: "",
  end_date: todayStr,
  end_date_err: "",
  bowls: {
    bowl_name: "Earl Anthony's Dublin Bowl",
    city: "Dublin",
    state: "CA",
    url: "https://www.earlanthonysdublinbowl.com/",
  },
}