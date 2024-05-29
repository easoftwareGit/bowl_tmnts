import axios from "axios";
import { baseBowlsApi } from "../apiPaths";
import { testBaseBowlsApi } from "../../../test/testApi";

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
export const getBowls = async () => {  
  // for testing.
  // if testing: tmntYearUrl = testBaseBowlsApi;
  // if not testing: tmntYearUrl = baseBowlsApi
  const url = testBaseBowlsApi.startsWith("undefined")
    ? baseBowlsApi
    : testBaseBowlsApi;    
  const response = await axios.get(url);
  return response.data; // response.data is already JSON'ed
};
