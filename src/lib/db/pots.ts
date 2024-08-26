// import { prisma } from "../prisma";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

/**
 * finds one pot by searching for a matching pot id
 *
 * @param {id} - pot id
 * @return {Object|null} Object = User's data; mull = user not found
 */
export async function findPotById(id: string) {
  try {
    // validate the id as a pot id
    if (!isValidBtDbId(id, 'pot')) {
      return null;
    }
    // find pot in database by matching id
    const pot = await prisma.pot.findUnique({
      where: {
        id: id,
      },
    });    
    return (pot) ? pot : null;
  } catch (error) {
    throw Error('error finding pot')
  }
}