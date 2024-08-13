import { baseApi } from "@/lib/tools";

export const baseUsersApi = baseApi + '/users'

export const baseRegisterApi = baseApi + '/auth/register'
export const baseNextAuthApi = baseApi + '/auth/[...nextauth]'

export const baseBowlsApi = baseApi + '/bowls'

export const baseTmntsApi = baseApi + '/tmnts/'
export const baseTmntsYearsApi = baseApi + '/tmnts/years/'

export const baseEventsApi = baseApi + '/events'