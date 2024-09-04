"use server"

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server" 
// directive in a client file will cause an error. 

import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import { isValidBtDbId } from "@/lib/validation";

/**
 * finds one brkt by searching for a matching brkt id
 *
 * @param {id} - brkt id
 * @return {Object|null} Object = brkt's data; mull = brkt not found
 */
export async function findBrktById(id: string) {
  try {
    // validate the id as an brkt id
    if (!isValidBtDbId(id, 'brk')) {
      return null;
    }
    // find brkt in database by matching id
    const brkt = await prisma.brkt.findUnique({
      where: {
        id: id,
      },
    });    
    return (brkt) ? brkt : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message)
    } else {
      throw Error('error finding event')
    }
  }
}
