const testBaseHost = process.env.TEST_BASE_HOST
const testBaseRoot = process.env.TEST_BASE_ROOT
const testBasePort = process.env.TEST_BASE_PORT;
const testbaseOrigin = `${testBaseRoot}${testBaseHost}:${testBasePort}`

export const testBaseApi = testbaseOrigin + process.env.TEST_BASE_API  

export const testBaseUsersApi = testBaseApi + '/users'

export const testBaseBowlsApi = testBaseApi + '/bowls'

export const testbaseTmntsApi = testBaseApi + '/tmnts/'
export const testbaseTmntsResultsApi = testBaseApi + '/tmnts/results/'
export const testbaseTmntsUpcomingApi = testBaseApi + '/tmnts/upcoming'
export const testbaseTmntsYearsApi = testBaseApi + '/tmnts/years/'


