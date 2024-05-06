import { tmntType } from "@/lib/types/types";
import { dateTo_UTC_MMddyyyy, dateTo_UTC_yyyyMMdd, todayStr } from "@/lib/dateTools";

export const mockUpcoming: tmntType[] = [
  {
    id: "tmt_e134ac14c5234d708d26037ae812ac33",
    tmnt_name: "Gold Pin",
    tmnt_name_err: "",
    start_date: dateTo_UTC_yyyyMMdd(new Date(2024, 12, 29)), 
    start_date_err: "",
    end_date: dateTo_UTC_yyyyMMdd(new Date(2024, 12, 29)),
    end_date_err: "",
    bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
    bowl_id_err: "",
    bowls: {
      bowl_name: "Earl Anthony's Dublin Bowl",
      city: "Dublin",
      state: "CA",
      url: "https://www.earlanthonysdublinbowl.com/",
    },
  },
  {
    id: "tmt_718fe20f53dd4e539692c6c64f991bbe",
    tmnt_name: "2-Day event",
    tmnt_name_err: "",
    start_date: dateTo_UTC_yyyyMMdd(new Date(2024, 12, 30)), 
    start_date_err: "",
    end_date: dateTo_UTC_yyyyMMdd(new Date(2024, 12, 31)),
    end_date_err: "",
    bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
    bowl_id_err: "",
    bowls: {
      bowl_name: "Earl Anthony's Dublin Bowl",
      city: "Dublin",
      state: "CA",
      url: "https://www.earlanthonysdublinbowl.com/",
    },
  },
]