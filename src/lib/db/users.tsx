// import { prisma } from "../prisma";
import { prisma } from "@/lib/prisma";
import { isEmail, isValidBtDbId, maxEmailLength } from "../validation";

/**
 * finds one user by searching for a matching email address
 *
 * @param {string} email - user's email
 * @return {Object|null} Object = User's data; mull = user not found
 */
export async function findUserByEmail(email: string) {
  try {
    // validate email
    if (!email || !isEmail(email) || email.length > maxEmailLength) {
      return null;
    }
    // find user in database by matching email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });    
    return (user) ? user : null;
  } catch (error) {
    throw Error('error finding user')
  }
}

/**
 * finds one user by searching for a matching id
 *
 * @param {string} id - user's email
 * @return {Object|null} Object = User's data; mull = user not found
 */
export async function findUserById(id: string) {
  try {
    // validate the id as a user id
    if (!isValidBtDbId(id, 'usr')) {
      return null;
    }
    // find user in database by matching id
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });    
    return (user) ? user : null;
  } catch (error) {
    throw Error('error finding user')
  }
}