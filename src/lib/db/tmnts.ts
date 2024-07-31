import axios from 'axios'
import { prisma } from "@/lib/prisma";
import { baseApi } from '../tools';
import { testbaseTmntsApi, testbaseTmntsYearsApi } from "../../../test/testApi";
import { isValidBtDbId } from '../validation';

const baseTmntsApi = baseApi + '/tmnts';
const baseTmntsYearsApi = baseApi + '/tmnts/years';

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

// /**
//  * get array of tmnts
//  * 
//  * @returns {data: tmntDataType[]} object with array of tmnts from database,
//  * or empty array if no data or error  
//  */
// export const getTmntResults = async () => {  
//   const url = baseTmntsApi + '/results'  
//   try {
//     const response = await axios.get(url)
//     if (response.status === 200 && response.data) {
//       return response.data; // response.data is already JSON'ed
//     } else {      
//       return [];
//     }
//   } catch (error) {
//     return [];
//   }
// }

// /**
//  * get array of upcoming tmnts
//  * 
//  * @returns {data: tmntDataType[]} object with array of upcoming tmnts from database,
//  * or empty array if no data or error
//  */
// export const getTmntUpcoming = async () => {  
//   const url = baseTmntsApi + '/upcoming'  
//   try {
//     const response = await axios.get(url)
//     if (response.status === 200 && response.data) {
//       return response.data; // response.data is already JSON'ed
//     } else {
//       console.log('Tmnt Upcoming - Non error return, but not status 200');
//       return [];
//     }
//   } catch (error) {
//     return [];
//   }
// }

/**
 * find tmnt in database by id
 * 
 * @param {string} tmntId - tmnt id for tournament to find in database
 * @returns {tmntDataType} object with tournament from database, or null if not found
 */
export const findTmntById = async (tmntId: string) => {
  // const url = 'http://localhost:3000/api/tmnts/tmntid'

  if (!isValidBtDbId(tmntId, 'tmt')) {
    return null;
  }
  const url = baseApi + '/tmnts/' + tmntId  
  try {
    // find tmnt in databaseby id
    const tmnt = await prisma.tmnt.findUnique({
      where: { id: tmntId },
    })
    return (tmnt) ? tmnt : null;
  } catch (error) {
    return null;
  }
}