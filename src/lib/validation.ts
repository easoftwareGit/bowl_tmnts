export const maxFirstNameLength = 15;
export const maxLastNameLength = 20;
export const maxEmailLength = 30;
export const maxPhoneLength = 20;
export const maxTmntNameLength = 30;
export const maxEventLength = 20;

export const minTeamSize = 1;
export const maxTeamSize = 5;
export const minGames = 1;
export const maxGames = 99;
export const maxEvents = 10;
export const minHdcpPer = 0;
export const maxHdcpPer = 125;
export const minHdcpFrom = 0;
export const maxHdcpFrom = 300;
export const zeroAmount = 0;
export const minFee = 1;
export const maxMoney = 999999;

export const minSortOrder = 1;
export const maxSortOrder = 1000;

export const minYear = 1900;
export const maxYear = 2100;

export enum ErrorCode {
  None = 0,
  MissingData = -1,
  InvalidData = -2,
  OtherError = -99,
}

/**
 * checks if string is in a valid email format
 *
 * @param {string} str
 * @return {*}  {boolean} - true: str has a valid email format;
 */
export function isEmail(str: string): boolean {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(str);
}

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
  return regex.test(str);
}

const validIdTypes = [
  "usr",
  "bwl",
  "tmt",
  "evt",
  "div",
  "sqd",
  "hdc",
  "fea",
  "dvf",
  "sef",
  "elf",
  "brf",
  "brd",
  "ply",
];

/**
 * checks if string is a valid BtDb id
 *  3 lowercase letters
 *  1 underscore
 *  32 hexidecimals in lowercase
 *
 * @param {string} str
 * @return {*}  {boolean} - true: str is a valid BtDb id ;
 */
export function isValidBtDbId(str: string): boolean {
  const idType = str.substring(0, 3);
  if (!validIdTypes.includes(idType)) return false;
  const regex = /^[a-z]{3}_[a-f0-9]{32}$/;
  return regex.test(str);
}

/**
 * checks if a string is gruops of one or two digits, sererated by commas
 * 
 * @param {string} str 
 * @return {*}  {boolean} - true: str is a just numbers seperated by commas
 */
export function isValidStartingGames(str: string): boolean {
  const regex = /^\d(\d)?(,\d(\d)?)*$/;
  return regex.test(str);
}

/**
 * checks if a year is valid = four digits and between 1900 and 2100 inclusive
 *
 * @param {string} year - in YYYY format
 * @return {*}  {boolean} - true if year is a valid year
 */
export const validYear = (year: string): boolean => {
  if (!year || year.length !== 4) return false;
  const yearNum = parseInt(year, 10) || 0;
  if (yearNum < minYear || yearNum > maxYear) return false;
  return true;
};

/**
 * checks if a time is valid = HH:MM AM/PM for 12 hour, HH:MM for 24 hour
 *
 * @param time
 * @returns {*}  {boolean} - true if time is a valid time
 */
export const validTime = (time: string): boolean => {
  // 12 hour: HH:MM AM/PM or 24 hour: HH:MM
  if (!time || !(time.length === 5 || time.length === 8)) return false;
  const regex =
    time.length === 5
      ? /^(1[0-9]|0?[1-9]|2[0-3]):[0-5][0-9]$/
      : /^(0[1-9]|1[0-2]):[0-5][0-9]\s(?:AM|PM)$/;
  return regex.test(time);
};