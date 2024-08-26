import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

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
  } catch (error) {
    throw Error('error finding lane')
  }
}