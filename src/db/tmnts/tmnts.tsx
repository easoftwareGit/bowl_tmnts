import axios from "axios";
import { baseTmntsApi } from "../apiPaths";
import { testbaseTmntsApi } from "../../../test/testApi";

/**
 * get array of tmnts
 * 
 * NOTE:
 * Do not use try / catch blocks here. Need the promise to be fulfilled
 * or rejected in /src/redux/features/tmnts/tmntsSlice.tsx
 * which will have the appropriate response in the extraReducers.

 * @param {string} year - "": upcoming tmnts, yyyy - tmnts for year yyyy
 * ok to pass year as param, API route checks for valid year
 * @returns {data: tmntDataType[]} object with array of tmnts from database
 */ 
export const getTmnts = async (year: string) => {
  // for testing.
  // if testing: tmntYearUrl = testbaseTmntYearsApi;
  // if not testing: tmntYearUrl = baseTmntYearsApi
  const tmntsUrl = testbaseTmntsApi.startsWith("undefined")
    ? baseTmntsApi
    : testbaseTmntsApi;  
  const url = tmntsUrl + ((year === "") ? 'upcoming' : "results/" + year);
  const response = await axios.get(url); 
  return response.data; // response.data is already JSON'ed
}