import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

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
  } catch (error) {
    throw Error('error finding squad')
  }
}