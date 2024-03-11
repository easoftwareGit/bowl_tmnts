const baseRoot = process.env.NEXT_PUBLIC_BASE_ROOT;
const baseHost = process.env.NEXT_PUBLIC_BASE_HOST; 
const basePort = process.env.NEXT_PUBLIC_BASE_PORT;
export const baseOrigin = `${baseRoot}${baseHost}:${basePort}`

export const baseApi = baseOrigin + process.env.NEXT_PUBLIC_BASE_API;
