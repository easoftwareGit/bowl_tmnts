// base on code in https://www.npmjs.com/package/string-sanitizer

// space, regular chars, digits, single quote and a dash
// why do ()*+ not work?
export const stringRegEx = /[^ a-zA-Z0-9'-.,]/g;

/**
 * trims tailing and leading spaces, 
 * removes special chars, allow only numbers, regular chars, 
 * space, period, dash, comma
 *
 * @param {string} str
 * @return {*}  {string} - "a.b-c@d e'fg#h1ক😀" returns "a.b-cd e'fgh1"
 */
export function sanitize(str: string): string {
  if (!str) {
    return ''
  }
  try {
    let san = decodeURIComponent(str);
    san = san.replace(/<[^>]*>/g, '').replace(stringRegEx, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\*/g, '').replace(/\+/g, ''); 
    if (san) {
      return san.trim();
    } else {
      return '';
    }    
  } catch (error) {
    return '';
  }
}

