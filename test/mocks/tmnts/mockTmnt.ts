import { todayStr } from "@/lib/dateTools";
import { tmntType, userType } from "@/lib/types/types";

export const mockUser: userType = {
  id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
  email: "john.doe@example.com",  
  password: "Test123!",
  first_name: "John",
  last_name: "Doe",
  phone: "800-555-1234",
  role: "DIRECTOR",
  password_hash: "$2b$12$C16ySjxkx1krojAMpoVZ3.v/pHt4ZtvDEBOXVGe4AUdPM0K/M4teq",
}

export const mockTmnt: tmntType = {
  id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
  user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde", 
  tmnt_name: "New Year's Eve 6 Gamer",
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
