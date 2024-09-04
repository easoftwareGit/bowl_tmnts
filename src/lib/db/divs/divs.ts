"use server"

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";

/**
 * finds one div by searching for a matching div id
 *
 * @param {id} - div id
 * @return {Object|null} Object = div's data; mull = div not found
 */
export async function findDivById(id: string) {
  try {
    // validate the id as a div id
    if (!isValidBtDbId(id, 'div')) {
      return null;
    }
    // find div in database by matching id
    const div = await prisma.div.findUnique({
      where: {
        id: id,
      },
    });    
    return (div) ? div : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding event')
    }
  }
}