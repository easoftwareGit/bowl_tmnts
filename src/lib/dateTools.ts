import { startOfToday, format } from "date-fns";

/**
 * formats a date into a string using yyyy-MM-dd
 * 
 * @param date 
 * @returns {*} string - date formatted as yyyy-MM-dd  2024-10-26
 */
export const dateTo_yyyyMMdd = (date: Date): string => {
  return format(date, "yyyy-MM-dd")
}

export const todayStr = dateTo_yyyyMMdd(startOfToday())

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
    const minutes = time.substring(3, 5)
    const ampm = time.substring(6).toUpperCase();
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;            
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0
    }
    const hoursStr = hours.toString().padStart(2, '0');
    return `${hoursStr}:${minutes}`;
  } catch (error) {
    return ''
  }
}

/**
 * gets the hours from a 24 hour time string HH:MM
 * 
 * @param time valid 24 hour time => HH:MM
 * @return {*} number - 0 to 23 for the hour 
 */
export const getHoursFromTime = (time: string): number => {
  try {
    return parseInt(time.substring(0,2))
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
    return parseInt(time.substring(3,2))
  } catch (error) {
    return -1
  }
}