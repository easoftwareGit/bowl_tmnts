"use server"

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";

/**
 * finds one squad by searching for a matching squad id
 *
 * @param {id} - squad id
 * @return {Object|null} Object = squad's data; mull = squad not found
 */
export async function findSquadById(id: string) {
  try {
    // validate the id as an squad id
    if (!isValidBtDbId(id, 'sqd')) {
      return null;
    }
    // find squad in database by matching id
    const squad = await prisma.squad.findUnique({
      where: {
        id: id,
      },
    });    
    return (squad) ? squad : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding event')
    }
  }
}