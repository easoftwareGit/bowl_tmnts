import { squadType } from "@/app/dataEntry/tmnt/types";
import { todayStr } from "@/lib/dateTools";

export const mockSquads: squadType[] = [
  {
    id: "sqd_e214ede16c5c46a4950e9a48bfeef61a",
    event_id: "evt_6ff6774e94884658be5bdebc68a6aa7c",    
    event_id_err: '',
    tab_title: "Singles",
    squad_name: "Singles",
    squad_name_err: "",
    games: 3,
    games_err: "",
    squad_date: todayStr,
    squad_date_err: "",
    squad_time: "10:00",
    squad_time_err: "",
    sort_order: 1,
    errClassName: "",   
  },
  {
    id: "sqd_c14918f162ac4acfa3ade3fdf90f17b6",
    event_id: "evt_20235232fd444241ace86e6e58b01ad8",    
    event_id_err: "",
    tab_title: "Doubles",
    squad_name: "Doubles",
    squad_name_err: "",
    games: 3,
    games_err: "",
    squad_date: todayStr,
    squad_date_err: "",
    squad_time: "12:30",
    squad_time_err: "",
    sort_order: 2,
    errClassName: "",   
  },
]