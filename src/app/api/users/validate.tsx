import { ErrorCode, maxFirstNameLength, maxLastNameLength, isEmail, isPassword8to20, isValidBtDbId } from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { userType } from "@/lib/types/types";
import { phone as phoneChecking } from "phone";
import { nextPostSecret } from "@/lib/tools";

/**
 * checks for required data and returns error code if missing 
 *  
 * @param user - user data to check 
 * @param checkPhoneAndPass - true if phone and password are to be checked
 * @returns - {ErrorCode.MissingData, ErrorCode.None, ErrorCode.OtherError}
 */
const gotUserData = (user: userType, checkPhoneAndPass: boolean = true): ErrorCode => {
  try {
    if (!sanitize(user.first_name)
      || !sanitize(user.last_name)
      || !(user.email)) {
        return ErrorCode.MissingData
    }
    if (checkPhoneAndPass) {
      if (!user.phone || !user.password) {
        return ErrorCode.MissingData
      }
    }
    return ErrorCode.None
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const validUserFirstName = (firstName: string): boolean => {  
  return (firstName.length > 0 && sanitize(firstName).length <= maxFirstNameLength)
}
export const validUserLastName = (lastName: string): boolean => {  
  return (lastName.length > 0 && sanitize(lastName).length <= maxLastNameLength)
}
export const validUserEmail = (email: string): boolean => {
  return (email.length > 0 && isEmail(email))
}
export const validUserPhone = (phone: string): boolean => {
  return (phone.length > 0 && phoneChecking(phone).isValid)
}
export const validUserPassword = (password: string): boolean => {
  return (password.length > 0 && isPassword8to20(password))
}

/**
 * checks if user data is valid
 * 
 * @param user - user data to check
 * @param checkPhoneAndPass - true if phone and password are to be checked
 * @returns - {ErrorCode.InvalidData, ErrorCode.None, ErrorCode.OtherError}
 */
const validUserData = (user: userType, checkPhoneAndPass: boolean = true): ErrorCode => {
  
  try {
    if (!validUserFirstName(user.first_name)) {
      return ErrorCode.InvalidData
    }
    if (!validUserLastName(user.last_name)) {
      return ErrorCode.InvalidData
    }
    if (!validUserEmail(user.email)) {
      return ErrorCode.InvalidData
    }
    if (checkPhoneAndPass) {
      if (!validUserPhone(user.phone)) {
        return ErrorCode.InvalidData
      }
      if (!validUserPassword(user.password)) {
        return ErrorCode.InvalidData
      }
    }
    return ErrorCode.None
  } catch (error) {
    return ErrorCode.OtherError
  }
}

/**
 * sanitizes user data to replace unwanted characters and format phone
 * 
 * @param user - user data to scrub
 * @returns - sanitized user: 
 *  - sanitized first & last name
 *  - phone in correct format (not validated, just format OK) 
 */
export const sanitizeUser = (user: userType): userType => {

  const sanitizedUser: userType = {
    ...user,    
  }
  sanitizedUser.first_name = sanitize(user.first_name)
  sanitizedUser.last_name = sanitize(user.last_name)
  const phoneCheck = phoneChecking(user.phone);  
  if (phoneCheck.isValid) {
    sanitizedUser.phone = phoneCheck.phoneNumber
  }  
  return sanitizedUser
}

/**
 * valildates a user data object
 * 
 * @param user - user data to check
 * @param checkPhoneAndPass - true if phone and password are to be checked
 * @returns - {ErrorCode.MissingData, ErrorCode.InvalidData, ErrorCode.None, ErrorCode.OtherError} 
 */
export function validateUser(user: userType, checkPhoneAndPass: boolean = true): ErrorCode { 

  try {
    const errCode = gotUserData(user, checkPhoneAndPass)
    if (errCode !== ErrorCode.None) {
      return errCode
    }
    return validUserData(user, checkPhoneAndPass)
  } catch (error) {
    return ErrorCode.OtherError
  }
}

/**
 * checks if post id is valid
 *
 * @export
 * @param {string} id
 * @return {string} - the valid user id if: str starts with postSecret and ends with a valid user BtDb id;
 *                  - otherwise returns an empty string
 */
export function validPostUserId(id: string): string {   
  if (id?.startsWith(nextPostSecret as string)) {
    const postId = id.replace(nextPostSecret as string, '');
    if (postId.startsWith('usr') && isValidBtDbId(postId)) {
      return postId
    }
    return ''
  } else {
    return ''
  }
}

export const exportedForTesting = {
  gotUserData,
  validUserData 
}