import axios from "axios";
import { baseTmntsYearsApi } from "../apiPaths";
import { testbaseTmntsYearsApi } from "../../../test/testApi";

/**
 * get array of years from today and before
 *
 * NOTE:
 * Do not use try / catch blocks here. Need the promise to be fulfilled
 * or rejected in /src/redux/features/tmnts/yearsSlice.tsx
 * which will have the appropriate response in the extraReducers.
 *
 * @returns { YearObj[] } - array of years;
 */
export const getTmntYears = async () => {
  const year = new Date().getFullYear().toString();
  // for testing.
  // if testing: tmntYearUrl = testbaseTmntYearsApi;
  // if not testing: tmntYearUrl = baseTmntYearsApi
  const tmntYearUrl = testbaseTmntsYearsApi.startsWith("undefined")
    ? baseTmntsYearsApi
    : testbaseTmntsYearsApi;  
  const url = tmntYearUrl + year;
  const response = await axios.get(url);
  return response.data; // response.data is already JSON'ed
};
