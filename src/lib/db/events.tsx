// import { prisma } from "../prisma";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";
import { eventType } from "../types/types";

/**
 * finds one event by searching for a matching event id
 *
 * @param {id} - event id
 * @return {Object|null} Object = User's data; mull = user not found
 */
export async function findEventById(id: string) {
  try {
    // validate the id as an event id
    if (!isValidBtDbId(id, 'evt')) {
      return null;
    }
    // find user in database by matching email
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });    
    return (event) ? event : null;
  } catch (error) {
    throw Error('error finding event')
  }
}