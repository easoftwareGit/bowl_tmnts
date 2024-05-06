import { laneType, squadType } from "@/lib/types/types";
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
    lane_count: 20,
    lane_count_err: "",
    starting_lane: 1,
    starting_lane_err: "",
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
    lane_count: 10,
    lane_count_err: "",
    starting_lane: 1,
    starting_lane_err: "",
    squad_date: todayStr,
    squad_date_err: "",
    squad_time: "12:30",
    squad_time_err: "",
    sort_order: 2,
    errClassName: "",
  },
]

export const mockLanes: laneType[] = [
  {
    id: '1',
    lane: 1,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '2',
    lane: 2,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '3',
    lane: 3,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '4',
    lane: 4,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '5',
    lane: 5,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '6',
    lane: 6,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '7',
    lane: 7,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a', 
  },
  {
    id: '8',
    lane: 8,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '9',
    lane: 9,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '10',
    lane: 10,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '11',
    lane: 11,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '12',
    lane: 12,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '13',
    lane: 13,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',    
  },
  {
    id: '14',
    lane: 14,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '15',
    lane: 15,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '16',
    lane: 16,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '17',
    lane: 17,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '18',
    lane: 18,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '19',
    lane: 19,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '20',
    lane: 20,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a', 
  },
  {
    id: '21',
    lane: 1,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '22',
    lane: 2,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '23',
    lane: 3,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '24',
    lane: 4,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '25',
    lane: 5,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '26',
    lane: 6,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '27',
    lane: 7,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '28',
    lane: 8,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '29',
    lane: 9,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '30',
    lane: 10,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  }
]