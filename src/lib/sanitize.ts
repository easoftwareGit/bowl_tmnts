// base on code in https://www.npmjs.com/package/string-sanitizer

import { maxUrlLength } from "./validation";

// space, regular chars, digits, single quote, exclamation and a dash 
// why do ()*+ not work?
export const stringRegEx = /[^ a-zA-Z0-9'+-.,]/g;

/**
 * trims tailing and leading spaces,
 * removes special chars, allow only numbers, regular chars,
 * space, period, dash, comma, plus
 *
 * @param {string} str
 * @return {*}  {string} - "a.b-c@d e'fg#h1ক😀" returns "a.b-cd e'fgh1"
 */
export function sanitize(str: string): string {
  if (!str) {
    return "";
  }
  try {
    let san
    try {
      san = decodeURIComponent(str);
    } catch (error) {
      san = str
    }    
    san = san.replace(/<[^>]*>/g, "")
    san = san.replace(stringRegEx, "")
    san = san.replace(/\(/g, "")
    san = san.replace(/\)/g, "")
    san = san.replace(/\*/g, "");
    if (san) {
      return san.trim();
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
}

export function sanitizeUrl(url: string): string {
  try {
    // maxUrlLength is 2048
    if (url.length > maxUrlLength) {
      throw new Error("URL exceeds maximum length");
    }
    let parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
    let sanitizedUrl = parsedUrl.protocol + "//" + parsedUrl.hostname;
    if (parsedUrl.port) {
      sanitizedUrl += ":" + parsedUrl.port;
    }
    sanitizedUrl += parsedUrl.pathname;
    if (parsedUrl.search) {
      sanitizedUrl += parsedUrl.search;
    }
    if (parsedUrl.hash) {
      sanitizedUrl += parsedUrl.hash;
    }
    if (sanitizedUrl.endsWith("/")) {
      sanitizedUrl = sanitizedUrl.slice(0, -1);
    }
    return sanitizedUrl;
  } catch (error) {    
    return "";
  }
}

export function sanitizeCurrency(currency: string): string {

  if (!currency) return "";
  
  // Regular expression to match a number with 0, 1, or 2 digits after an optional decimal point
  const regex = /^\d+(\.\d{1,2})?$/;

  // If the currency matches the regex, it is already valid
  if (regex.test(currency) &&
      !(currency.endsWith(".00") || currency.endsWith(".0"))) {
    return currency;
  }

  // Further validation to ensure no invalid characters are present
  if (!/^[-\d.]+$/.test(currency) || (currency.match(/\./g) || []).length > 1 || (currency.match(/-/g) || []).length > 1 || (currency.indexOf('-') > 0)) {
    return "";
  }

  // Try to parse the currency as a float
  const parsedNumber = parseFloat(currency);

  // If the parsed number is NaN, return an empty string 
  if (isNaN(parsedNumber)) {
    return "";
  }

  // Convert the number to string
  let numberStr = parsedNumber.toString();

  // Check for decimal point
  const decimalIndex = numberStr.indexOf(".");
  if (decimalIndex !== -1) {
    // If there are more than 2 digits after the decimal point, trim the excess
    if (numberStr.length - decimalIndex - 1 > 2) {
      numberStr = numberStr.substring(0, decimalIndex + 3);
    }
  }

  if (numberStr.endsWith(".00") || numberStr.endsWith(".0")) {
    numberStr = numberStr.substring(0, decimalIndex);
  }

  return numberStr;
}
