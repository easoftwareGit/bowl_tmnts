"use server"

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";
/**
 * finds one elim by searching for a matching elim id
 *
 * @param {id} - elim id
 * @return {Object|null} Object = elim's data; mull = elim not found
 */
export async function findElimById(id: string) {
  try {
    // validate the id as an elim id
    if (!isValidBtDbId(id, 'elm')) {
      return null;
    }
    // find elim in database by matching id
    const elim = await prisma.elim.findUnique({
      where: {
        id: id,
      },
    });    
    return (elim) ? elim : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding event')
    }
  }
}
