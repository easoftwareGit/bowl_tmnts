// import { prisma } from "../prisma";
import { prisma } from "@/lib/prisma";
import { isEmail, maxEmailLength } from "../validation";

/**
 * finds one user by searching for a matching email address
 *
 * @param {string} email - already sanitized
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
    if (!user) {
      return null;
    } else {
      return user
    }    
  } catch (error) {
    throw Error('error finding user')
  }
}