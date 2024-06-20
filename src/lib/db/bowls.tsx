import axios from "axios";
import { prisma } from "@/lib/prisma";
import { baseBowlsApi } from "../../db/apiPaths";
import { testBaseBowlsApi } from "../../../test/testApi";
import { isValidBtDbId } from "../validation";

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

/**
 * finds one bowl by searching for a matching bowl id
 *
 * @param {id} - bowl id
 * @return {Object|null} Object = bowl's data; mull = bowl not found
 */
export async function findBowlById(id: string) {
  try {
    // validate the id as an bowl id
    if (!isValidBtDbId(id, 'bwl')) {
      return null;
    }
    // find bowl in database by matching id
    const bowl = await prisma.bowl.findUnique({
      where: {
        id: id,
      },
    });    
    return (bowl) ? bowl : null;
  } catch (error) {
    throw Error('error finding bowl')
  }
}