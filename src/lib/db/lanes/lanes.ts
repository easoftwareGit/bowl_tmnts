"use server"

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";

/**
 * finds one lane by searching for a matching lane id
 *
 * @param {id} - lane id
 * @return {Object|null} Object = lane's data; mull = lane not found
 */
export async function findLaneById(id: string) {
  try {
    // validate the id as an lane id
    if (!isValidBtDbId(id, 'lan')) {
      return null;
    }
    // find lane in database by matching id
    const lane = await prisma.lane.findUnique({
      where: {
        id: id,
      },
    });    
    return (lane) ? lane : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding event')
    }
  }
}