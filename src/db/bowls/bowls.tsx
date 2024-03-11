import axios from "axios";
import { baseBowlsApi } from "../apiPaths";
import { testBaseBowlsApi } from "../../../test/testApi";

/**
 * get array of years from today and before
 *
 * NOTE:
 * Do not use try / catch blocks here. Need the promise to be fulfilled
 * or rejected in /src/redux/features/bowls/bowlsSlice.tsx
 * which will have the appropriate response in the extraReducers.
 *
 * @returns { data: Bowl[] } - array of years;
 */
export const getBowls = async () => {
  const year = new Date().getFullYear().toString();
  // for testing.
  // if testing: tmntYearUrl = testbaseTmntYearsApi;
  // if not testing: tmntYearUrl = baseTmntYearsApi
  const url = testBaseBowlsApi.startsWith("undefined")
    ? baseBowlsApi
    : testBaseBowlsApi;    
  const response = await axios.get(url);
  return response.data; // response.data is already JSON'ed
};
