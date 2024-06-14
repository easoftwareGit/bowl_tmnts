import { sanitizeCurrency } from "../sanitize";

/**
 * checks if money string is valid
 * 
 * @param moneyStr - money to check
 * @param min - minimum amount
 * @param max - maximum amount
 * @returns boolean - true if amount is valid
 */
export const validMoney = (moneyStr: string, min: number, max: number): boolean => {  
  let sanMoney = sanitizeCurrency(moneyStr);
  if (!sanMoney) return false;
  try {
    const numVal = Number(sanMoney)
    if (isNaN(numVal) || numVal < min || numVal > max) {
      return false
    }
    return true
  } catch (error) {
    return false
  }  
}