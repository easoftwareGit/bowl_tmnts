import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "../validation";

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
  } catch (error) {
    throw Error('error finding brkt')
  }
}
