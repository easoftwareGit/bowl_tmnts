// import { prisma } from "../prisma";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

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
  } catch (error) {
    throw Error('error finding div')
  }
}