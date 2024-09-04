"use server"

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";

/**
 * finds one pot by searching for a matching pot id
 *
 * @param {id} - pot id
 * @return {Object|null} Object = User's data; mull = user not found
 */
export async function findPotById(id: string) {
  try {
    // validate the id as a pot id
    if (!isValidBtDbId(id, 'pot')) {
      return null;
    }
    // find pot in database by matching id
    const pot = await prisma.pot.findUnique({
      where: {
        id: id,
      },
    });    
    return (pot) ? pot : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding event')
    }
  }
}