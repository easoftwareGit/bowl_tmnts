// import { prisma } from "../prisma";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";
import { eventType } from "../types/types";

/**
 * finds one div by searching for a matching div id
 *
 * @param {id} - div id
 * @return {Object|null} Object = User's data; mull = user not found
 */
export async function findDivById(id: string) {
  try {
    // validate the id as an event id
    if (!isValidBtDbId(id, 'div')) {
      return null;
    }
    // find user in database by matching email
    const div = await prisma.div.findUnique({
      where: {
        id: id,
      },
    });    
    return (div) ? div : null;
  } catch (error) {
    throw Error('error finding div')
  }
}