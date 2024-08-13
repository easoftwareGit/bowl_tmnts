import { IntlConfig } from "@/lib/currency/components/CurrencyInputProps";
import { startOfToday, addMinutes, isValid, addSeconds, addDays, addMilliseconds } from "date-fns";

const ic: IntlConfig = {
  // locale: window.navigator.language,
  locale: 'en-US'
};

/**
* formats a date into a string using yyyy-MM-dd
* 
* @param date 
* @returns {*} string - date formatted as yyyy-MM-dd  2024-10-26
*/
export const dateTo_UTC_yyyyMMdd = (date: Date): string => {
  if (!isValid(date)) return '';
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
}

/**
* formats a date into a string using yyyy-MM-dd
* 
* @param date 
* @returns {*} string - date formatted as yyyy-MM-dd  2024-10-26
*/
export const dateTo_yyyyMMdd = (date: Date): string => {
  if (!isValid(date)) return '';
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

/**
* formats a date into a string using yyyy-MM-dd
* 
* @param date 
* @returns {*} string - date formatted as MM/dd/yyyy  10/26/2024
*/
export const dateTo_UTC_MMddyyyy = (date: Date): string => {
  if (!isValid(date)) return '';
  return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getUTCFullYear()}`
}

/**
* formats a date into a string using yyyy-MM-dd
* 
* @param date 
* @returns {*} string - date formatted as yyyy-MM-dd  10/26/2024
*/
export const dateTo_MMddyyyy = (date: Date): string => {
  if (!isValid(date)) return '';
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
}

/**
 * returns the end of a day from a date string
 * 
 * @param dateStr - string to convert to end of day
 * @returns {Date | null}
 */
export const endOfDayFromString = (dateStr: string): Date | null => {
  if (!isValid(new Date(dateStr))) return null;
  const tsoMins = new Date().getTimezoneOffset()
  return addMilliseconds(addDays(addMinutes(new Date(dateStr), tsoMins), 1), -1)
}

/**
 * returns the day but with now as the time
 * 
 * @param dateStr - string to convert to day at now
 * @returns {Date | null}
 */
export const nowOnDayFromString = (dateStr: string): Date | null => {
  if (!isValid(new Date(dateStr))) return null;
  const tsoMins = new Date().getTimezoneOffset()
  const dayNow = addMinutes(new Date(dateStr), tsoMins) 
  const newNow = new Date()
  dayNow.setHours(newNow.getHours())
  dayNow.setMinutes(newNow.getMinutes())
  dayNow.setSeconds(newNow.getSeconds())      
  return dayNow
}

/**
 * returns the start of a day from a date string
 * 
 * @param dateStr - string to convert to start of day
 * @returns {Date | null}
 */
export const startOfDayFromString = (dateStr: string): Date | null => {
  if (!isValid(new Date(dateStr))) return null;
  const tsoMins = new Date().getTimezoneOffset()
  return addMinutes(new Date(dateStr), tsoMins) 
}

/**
 * returns the start of today in yyyy-MM-dd format
 * 
 * @returns {string} - strat of today in yyyy-MM-dd format
 */
// export const todayStr = dateTo_yyyyMMdd(startOfToday())
export const todayStr = dateTo_UTC_yyyyMMdd(startOfToday())

/**
 * returns today's year as a string in yyyy format
 */
export const todayYearStr = todayStr.substring(0, 4)

/**
 * returns the start of today in MM/dd/yyyy format
 * 
 * @returns {string} - strat of today in MM/dd/yyyy format
 */
export const todayStrMMddyyyy = dateTo_UTC_MMddyyyy(startOfToday())  

export type ymdType = {
  year: number
  month: number
  days: number
}
/**
 * returns the ymd from a date string
 * 
 * @param dateStr - date in YYYY-MM-DD format
 * @returns {ymdType} - {year, month, days} or {year: 0, month: 0, days: 0}
 */
export const getYearMonthDays = (dateStr: string): ymdType => { 
  const ymd: ymdType = { year: 0, month: 0, days: 0 }
  if (!dateStr || dateStr.length !== 10) return ymd;
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  if (!regex.test(dateStr)) return ymd;  
  ymd.year = Number(dateStr.substring(0, 4));
  ymd.month = Number(dateStr.substring(5, 7)) - 1;    
  ymd.days = Number(dateStr.substring(8, 10));
  return ymd
}

/**
 * returns the start of today in UTC 
 * 
 * @returns {Date} - strat of today in UTC
 */
export const startOfTodayUTC = (): Date => { 
  const todayYmd = getYearMonthDays(todayStr)
  return new Date(Date.UTC(todayYmd.year, todayYmd.month, todayYmd.days, 0, 0, 0, 0))
}


/**
 * returns true if dateStr is a valid full date iso string
 * 
 * @param dateStr - string in YYYY-MM-DDTHH:MM:SS.sssZ format
 * @returns {boolean} - true if dateStr is a valid full date iso string
 */
export const validFullDateISOString = (dateStr: string): boolean => { 
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\.\d{3}Z$/
  return regex.test(dateStr)
}

/**
 * formats a date into a 24 hour time string
 *
 * @param {Date} timeAsDate
 * @return {*} {string} - HH:MM or ''
 */
export const getTimeString = (timeAsDate: Date): string => {  
  if (timeAsDate) {
    const offset = timeAsDate.getTimezoneOffset();
    let currentDateTime = new Date(
      timeAsDate.getFullYear(),
      timeAsDate.getMonth() - 1,
      timeAsDate.getDate(),
      timeAsDate.getHours(),
      timeAsDate.getMinutes() + offset
    );
    const timeStr = currentDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return twelveHourto24Hour(timeStr);
  }
  return "";
}

/**
 * converts a 12 hour format time into a 24 hour format time 
 * HH:MM AM => HH:MM,  HH:MM PM -> HH+12:MM
 * note: NO SECONDS!!!
 *
 * @param {string} time - a valid 12 hour time w/o seconds HH:MM AM/PM
 * @return {*} {string} - a 24 hour time string
 */
export const twelveHourto24Hour = (time: string): string => {
  try {
    let hours = parseInt(time.substring(0, 2))   
    if (isNaN(hours) || hours < 0 || hours > 23) {
      return ''
    }
    const minutes = parseInt(time.substring(3, 5))
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      return ''
    }
    const ampm = time.substring(6).toUpperCase();
    if (ampm.length > 0 && !(ampm.toLowerCase() === 'am' || ampm.toLowerCase() === 'pm')) {
      return ''
    }
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;            
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0
    }
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
  } catch (error) {
    return ''
  }
}

export const validTime = (time: string): boolean => {
  // 12 hour: HH:MM AM/PM or 24 hour: HH:MM
  if (!time || !(time.length === 5 || time.length === 8)) return false;
  const regex =
    time.length === 5
      ? /^(1[0-9]|0?[1-9]|2[0-3]):[0-5][0-9]$/
      : /^(0[1-9]|1[0-2]):[0-5][0-9]\s(?:AM|PM|am|pm)$/;
  return regex.test(time);
}

/**
 * gets the hours from a 24 hour time string HH:MM
 * 
 * @param time valid 24 hour time => HH:MM
 * @return {*} number - 0 to 23 for the hour 
 */
export const getHoursFromTime = (time: string): number => {
  try {
    if (!validTime(time)) return -1
    const hours = parseInt(time.substring(0, 2))    
    return hours    
  } catch (error) {
    return -1
  }
}

/**
 * gets the minute from a 24 hour time string HH:MM
 * 
 * @param time valid 24 hour time => HH:MM
 * @return {*} number - 0 to 59 for the minute
 */
export const getMinutesFromTime = (time: string): number => {
  try {
    if (!validTime(time)) return -1
    const minutes = parseInt(time.substring(3, 5))
    return minutes
  } catch (error) {
    return -1
  }
}
