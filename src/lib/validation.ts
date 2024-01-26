export const maxFirstNameLength = 15;
export const maxLastNameLength = 20;
export const maxEmailLength = 30;
export const maxPhoneLength = 20;
export const maxTmntNameLength = 30;
export const maxEventLength = 20;

/**
 * checks if string is in a valid email format
 *
 * @param {string} str
 * @return {*}  {boolean} - true: str has a valid email format;
 */
export function isEmail(str: string): boolean {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return (regex.test(str)) 
};

/**
 * checks if string is a valid password
 *  8-20 chars long
 *  at least 1 UPPER case char
 *  at least 1 lower case char
 *  at least 1 digit
 *  at least on special char
 *
 * @param {string} str
 * @return {*}  {boolean} - true: str has a valid password format;
 */
export function isPassword8to20(str: string): boolean {
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
  return (regex.test(str))
};