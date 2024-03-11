// base on code in https://www.npmjs.com/package/string-sanitizer

// space, regular chars, digits, single quote and a dash
export const stringRegEx = /[^ a-zA-Z0-9'-.]/g;

/**
 * trims tailing and leading spaces, 
 * removes special chars, allow only numbers, regular chars, 
 * space, period, dash
 *
 * @param {string} str
 * @return {*}  {string} - "a.b-c@d e'fg#h1ক😀" returns "ab-cd e'fgh1"
 */
export function sanitize(str: string): string {
  if (!str) {
    return ''
  }
  const trimmed = str.trim();
  if (trimmed) {
    return trimmed.replace(stringRegEx, '');
  } else {
    return '';
  }  
}