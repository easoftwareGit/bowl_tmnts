import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

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
  } catch (error) {
    throw Error('error finding elim')
  }
}
