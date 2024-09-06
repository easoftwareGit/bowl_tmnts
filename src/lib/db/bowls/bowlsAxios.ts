import axios from "axios";
import { baseBowlsApi } from "@/lib/db/apiPaths";
import { testBaseBowlsApi } from "../../../../test/testApi";
import { Bowl } from "@prisma/client";

const url = testBaseBowlsApi.startsWith("undefined")
  ? baseBowlsApi
  : testBaseBowlsApi;   

/**
 * get array of bowls
 *
 * NOTE:
 * Do not use try / catch blocks here. Need the promise to be fulfilled
 * or rejected in /src/redux/features/bowls/bowlsSlice.tsx
 * which will have the appropriate response in the extraReducers.
 *
 * @returns { data: Bowl[] } - array of bowls;
 */

export const getBowls = async (): Promise<Bowl[]> => {  
  const response = await axios.get(url);  
  return (!response || response.status !== 200) 
    ? []
    : response.data.bowls;
};
