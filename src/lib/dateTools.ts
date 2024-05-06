import { IntlConfig } from "@/lib/currency/components/CurrencyInputProps";
const ic: IntlConfig = {
  // locale: window.navigator.language,
  locale: 'en-US'
};

import { startOfToday, format } from "date-fns";

/**
 * formats a date into a string using yyyy-MM-dd
 * 
 * @param date 
 * @returns {*} string - date formatted as yyyy-MM-dd  2024-10-26
 */
// export const dateTo_yyyyMMdd = (date: Date): string => {
//   return format(date, "yyyy-MM-dd")
// }

// export const dateTo_MMddyyyy = (date: Date): string => {
//   return format(date, "MM/dd/yyyy")
// }

// export const dateTo_localeDate = (date: Date): string => {
//   return new Intl.DateTimeFormat(ic.locale).format(date)
// }

/**
* formats a date into a string using yyyy-MM-dd
* 
* @param date 
* @returns {*} string - date formatted as yyyy-MM-dd  2024-10-26
*/
export const dateTo_UTC_yyyyMMdd = (date: Date): string => {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
}

/**
* formats a date into a string using yyyy-MM-dd
* 
* @param date 
* @returns {*} string - date formatted as MM/dd/yyyy  10/26/2024
*/
export const dateTo_UTC_MMddyyyy = (date: Date): string => {
  return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getUTCFullYear()}`
}

// export const todayStr = dateTo_yyyyMMdd(startOfToday())
export const todayStr = dateTo_UTC_yyyyMMdd(startOfToday())

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
