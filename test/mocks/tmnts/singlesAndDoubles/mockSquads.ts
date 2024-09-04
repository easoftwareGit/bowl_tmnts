import { laneType, squadType } from "@/lib/types/types";
import { startOfDayFromString, todayStr } from "@/lib/dateTools";
import { Squad } from "@prisma/client";

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
    squad_date: startOfDayFromString(todayStr) as Date, 
    squad_date_str: todayStr,
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
    squad_date: startOfDayFromString(todayStr) as Date,  
    squad_date_str: todayStr,
    squad_date_err: "",
    squad_time: "12:30",
    squad_time_err: "",
    sort_order: 2,
    errClassName: "",
  },
]

export const mockPrismaSquads: Squad[] = [
  {
    id: "sqd_42be0f9d527e4081972ce8877190489d",
    event_id: "evt_06055deb80674bd592a357a4716d8ef2",
    squad_name: "A Squad",
    squad_date: new Date(Date.UTC(2022, 7, 21)),  // month is -1 
    squad_time: '10:00 AM',
    games: 6,
    lane_count: 24,
    starting_lane: 1,
    sort_order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sqd_796c768572574019a6fa79b3b1c8fa57",
    event_id: "evt_06055deb80674bd592a357a4716d8ef2",
    squad_name: "B Squad",
    squad_date: new Date(Date.UTC(2022, 7, 21)),  // month is -1 
    squad_time: '02:00 PM',
    games: 6,
    lane_count: 24, 
    starting_lane: 1,
    sort_order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export const mockLanes: laneType[] = [
  {
    id: '1',
    lane_number: 1,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '2',
    lane_number: 2,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '3',
    lane_number: 3,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '4',
    lane_number: 4,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '5',
    lane_number: 5,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '6',
    lane_number: 6,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '7',
    lane_number: 7,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a', 
  },
  {
    id: '8',
    lane_number: 8,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '9',
    lane_number: 9,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '10',
    lane_number: 10,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '11',
    lane_number: 11,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '12',
    lane_number: 12,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '13',
    lane_number: 13,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',    
  },
  {
    id: '14',
    lane_number: 14,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '15',
    lane_number: 15,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '16',
    lane_number: 16,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '17',
    lane_number: 17,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '18',
    lane_number: 18,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '19',
    lane_number: 19,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a',
  },
  {
    id: '20',
    lane_number: 20,
    squad_id: 'sqd_e214ede16c5c46a4950e9a48bfeef61a', 
  },
  {
    id: '21',
    lane_number: 1,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '22',
    lane_number: 2,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '23',
    lane_number: 3,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '24',
    lane_number: 4,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '25',
    lane_number: 5,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '26',
    lane_number: 6,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '27',
    lane_number: 7,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '28',
    lane_number: 8,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '29',
    lane_number: 9,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  },
  {
    id: '30',
    lane_number: 10,
    squad_id: 'sqd_c14918f162ac4acfa3ade3fdf90f17b6',
  }
]