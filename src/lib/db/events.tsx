import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

/**
 * finds one event by searching for a matching event id
 *
 * @param {id} - event id
 * @return {Object|null} Object = event's data; mull = event not found
 */
export async function findEventById(id: string) {
  try {
    // validate the id as an event id
    if (!isValidBtDbId(id, 'evt')) {
      return null;
    }
    // find event in database by matching id
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
