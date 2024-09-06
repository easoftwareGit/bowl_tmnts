"use server"
// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";
import { Bowl } from "@prisma/client";

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

// export const getBowls = async (): Promise<Bowl[]> => {  
//   return prisma.bowl.findMany();
// };

/**
 * finds one bowl by searching for a matching bowl id
 *
 * @param {id} - bowl id
 * @return {Object|null} Object = bowl's data; mull = bowl not found
 */
export async function findBowlById(id: string): Promise<Bowl | null> {

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
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding bowl')
    }
  }
}