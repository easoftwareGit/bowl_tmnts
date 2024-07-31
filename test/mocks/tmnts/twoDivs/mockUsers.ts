import { initUser } from "@/db/initVals";
import { userType } from "@/lib/types/types";

export const mockUsers: userType[] = [
  { 
    ...initUser,
    id: "usr_a24894ed10c5dd835d5cbbfea7ac6dca",
    email: "eric@email.com",
    first_name: "Eric",
    last_name: "Johnson",
    phone: "+18005551234",
    role: 'DIRECTOR',
  },
]