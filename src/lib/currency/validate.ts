/**
 * checks if money string is valid
 * 
 * @param moneyStr - money to check
 * @param min - minimum amount
 * @param max - maximum amount
 * @returns boolean - true if amount is valid
 */
export const validMoney = (moneyStr: string, min: number, max: number): boolean => {  
  if (moneyStr === null || moneyStr === undefined) return false;
  if (typeof moneyStr !== "string") {
    if (typeof moneyStr === "number") {
      moneyStr = (moneyStr as number).toString();
    } else {
      return false;
    }
  }  
  // remove commas
  moneyStr = moneyStr.replace(/,/g, "");
  // remove leading '$"
  moneyStr = moneyStr.replace(/^\$/, "");  
  if (!moneyStr) return false;
  try {
    const numVal = Number(moneyStr)
    if (isNaN(numVal) || numVal < min || numVal > max) {
      return false
    }
    return true
  } catch (error) {
    return false
  }  
}