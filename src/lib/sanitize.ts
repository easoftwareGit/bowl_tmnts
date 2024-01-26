// base on code in https://www.npmjs.com/package/string-sanitizer

export const stringRegEx = /[^ a-zA-Z0-9'-]/g;

/**
 * removes special chars & spaces, allow only numbers and regular chars 
 *
 * @param {string} str
 * @return {*}  {string} - "a.b-c@d e'fg#h1ক😀" returns "ab-cd e'fgh1"
 */
export function sanitize(str: string): string {
  // space, regular chars, digits, single quote and a dash
  const regex = /[^ a-zA-Z0-9'-]/g;       
  return str.replace(stringRegEx, '');
}

