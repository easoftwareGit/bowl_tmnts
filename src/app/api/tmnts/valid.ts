export const validYear = (year: string): boolean => {

  if (!year || year.length !== 4) return false;
  const yearNum = parseInt(year, 10) || 0;  
  if (yearNum < 1900 || yearNum > 2100) return false;
  return true;
}
