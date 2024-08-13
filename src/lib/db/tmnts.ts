"use server"
// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing

// NOTE at the bottom of this file:
//    export const exportedForTesting = {
//      getTmntsForYear,
//      getUpcomingTmnts 
//    } 
// must be commented out for production & developemnt
// and uncommented for testing

import { isValidBtDbId, validYear } from '../validation';
import { tmntListType, YearObj } from "../types/types";
import { endOfDayFromString, startOfDayFromString, todayStr, todayYearStr } from "../dateTools";

/**
 * gets an array of tmnts for a year
 * 
 * @param {string} year - "": upcoming tmnts, yyyy - tmnts for year yyyy
 * @param {number} skip - number of tmnts to skip in data retrieval
 * @param {number} take - number of tmnts to take in data retrieval
 * @returns {data: tmntDataType[]} object with array of tmnts from database
 */
const getTmntsForYear = async (year: string, skip?: number, take?: number): Promise<tmntListType[]> => {

  // validate the year as a number
  if (!validYear(year)) {
    return [];
  }

  // get the max date for the tmnt
  const todayYear = todayStr.substring(0, 4);
  let maxDate
  if (todayYear === year) {
    maxDate = endOfDayFromString(todayStr) as Date
  } else {    
    maxDate = endOfDayFromString(`${year}-12-31`) as Date
  }
  const jan1st = startOfDayFromString(`${year}-01-01`) as Date

  const tmnts = await prisma.tmnt.findMany({
    where: {
      start_date: {
        lte: maxDate,
        gte: jan1st
      }
    },
    orderBy: [
      {
        start_date: 'desc'
      }
    ],
    select: {
      id: true,
      tmnt_name: true,
      start_date: true,
      bowls: {
        select: {
          bowl_name: true,
          city: true,
          state: true,
          url: true,
        },
      },
    },
    skip,
    take
  })
  return tmnts as tmntListType[]
}

/**
 * gets an array of upcoming tmnts, starting after today
 * 
 * @param {number} skip - number of tmnts to skip in data retrieval
 * @param {number} take - number of tmnts to take in data retrieval
 * @returns {data: tmntDataType[]} object with array of tmnts from database
 */
const getUpcomingTmnts = async (skip?: number, take?: number): Promise<tmntListType[]> => {
  const eot = endOfDayFromString(todayStr) as Date
  const tmnts = await prisma.tmnt.findMany({
    where: {
      start_date: {
        gt: eot
      }
    },
    orderBy: [
      {
        start_date: 'desc'
      }
    ],
    select: {
      id: true,
      tmnt_name: true,
      start_date: true,
      bowls: {
        select: {
          bowl_name: true,
          city: true,
          state: true,
          url: true,
        },
      },
    },
    skip,
    take
  })
  return tmnts as tmntListType[]
}

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
export const getTmnts = async (year: string, skip?: number, take?: number): Promise<tmntListType[]> => {

  if (year === "") {
    return await getUpcomingTmnts(skip, take) 
  } else {
    return await getTmntsForYear(year, skip, take) 
  }
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
export const getTmntYears = async (): Promise<YearObj[]> => {

  const lastDOY = endOfDayFromString(`${todayYearStr}-12-31`) as Date
  // ok to use queryRawUnsafe because setting the variable LastDOY, 
  // and NOT using user input
  const years = await prisma.$queryRawUnsafe(
    `SELECT DISTINCT extract(year from start_date) AS "year"
    FROM "Tmnt"
    WHERE start_date <= $1
    ORDER BY "year" DESC;`,
    lastDOY
  )
  return years as YearObj[];
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
 * @param {string} id - tmnt id for tournament to find in database
 * @returns {tmntDataType} object with tournament from database, or null if not found
 */
export const findTmntById = async (id: string) => {

  try {
    // validate the id as a user id
    if (!isValidBtDbId(id, 'tmt')) {
      return null;
    }
    const tmnt = await prisma.tmnt.findUnique({
      where: { id: id },
    })
    return (tmnt) ? tmnt : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding tmnt')
    }    
  }
}

// export const exportedForTesting = {
//   getTmntsForYear,
//   getUpcomingTmnts 
// }