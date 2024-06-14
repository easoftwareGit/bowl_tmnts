import { isValidBtDbId, maxTmntNameLength, ErrorCode } from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { startOfDay, isValid, isDate } from "date-fns";
import { idTypes, tmntType } from "@/lib/types/types";
import { initTmnt } from "@/db/initVals";

/**
 * checks for required data and returns error code if missing 
 * 
 * @param tmnt - tournament data to check
 * @returns - {ErrorCode.MissingData, ErrorCode.None, ErrorCode.OtherError}
 */
const gotTmntData = (tmnt: tmntType): ErrorCode => { 
  try {
    if (!sanitize(tmnt.tmnt_name)
      || (!tmnt.start_date && tmnt.end_date)
      || (tmnt.start_date && !tmnt.end_date)
      || !tmnt.bowl_id) {
      return ErrorCode.MissingData
    }
    return ErrorCode.None    
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const validTmntName = (tmntName: string): boolean => {  
  const sanitized = sanitize(tmntName);
  return (sanitized.length > 0 && sanitized.length <= maxTmntNameLength)
}

/**
 * checks if start and end dates are valid
 * 
 * @param startDateStr - start date as string
 * @param endDateStr = end date as string
 * @returns - boolean: true if dates are valid 
 */
export const validTmntDates = (startDateStr: string, endDateStr: string): boolean => { 
  // if both start and end dates, 
  //  - both must be valid dates
  //  - end cannot be before start  
  if (startDateStr && endDateStr) {
    const startDate = startOfDay(new Date(startDateStr))
    const endDate = startOfDay(new Date(endDateStr))
    if (!isValid(startDate) || !isValid(endDate)) {
      return false
    }       
    if (endDate < startDate) {
      return false
    }
    return true
    // if no dates - valid
  } else if (!startDateStr && !endDateStr) {
    return true
  }
  // if got only start or only end, not valid
  return false
}

/**
 * checks if foreign key is valid
 * 
 * @param FkId - foreign key 
 * @param idType - id type - 'usr' or 'bwl'
 * @returns boolean - true if foreign key is valid
 */
export const validTmntFkId = (FkId: string, idType: idTypes): boolean => { 

  if (!(FkId) || !isValidBtDbId(FkId, idType)) {
    return false
  }
  return (idType === 'bwl' || idType === 'usr')
}

/**
 * checks if tournament data is valid
 * 
 * @param tmnt - tournament data to check
 * @returns - {ErrorCode.InvalidData, ErrorCode.None, ErrorCode.OtherError}
 */
const validTmntData = (tmnt: tmntType): ErrorCode => { 

  try {           
    if (!tmnt) {
      return ErrorCode.InvalidData
    }
    if (!validTmntName(tmnt.tmnt_name)) {
      return ErrorCode.InvalidData
    }
    if (!validTmntDates(tmnt.start_date, tmnt.end_date)) {
      return ErrorCode.InvalidData
    }
    if (!validTmntFkId(tmnt.bowl_id, 'bwl')) {
      return ErrorCode.InvalidData
    }
    if (!validTmntFkId(tmnt.user_id, 'usr')) {
      return ErrorCode.InvalidData
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError
  }
}

/**
 * sanitizes tournament data  
 * 
 * @param tmnt  - tournament data to sanitize
 * @returns tmnt object with sanitized data
 */
export const sanitizeTmnt = (tmnt: tmntType): tmntType => { 

  // using initTmnt as a starting point, all user edited 
  // fields will be empty, except for start_date
  // so set start_date to empty string 
  const sanditizedTmnt: tmntType = {
    ...initTmnt,
    start_date: '',
  }  
  sanditizedTmnt.tmnt_name = sanitize(tmnt.tmnt_name)
  if (isValid(new Date(tmnt.start_date))) {
    sanditizedTmnt.start_date = tmnt.start_date    
  } 
  if (isValid(new Date(tmnt.end_date))) {
    sanditizedTmnt.end_date = tmnt.end_date    
  } 
  if (isValidBtDbId(tmnt.bowl_id, 'bwl')) {    
    sanditizedTmnt.bowl_id = tmnt.bowl_id  
  } 
  if (isValidBtDbId(tmnt.user_id, 'usr')) {
    sanditizedTmnt.user_id = tmnt.user_id
  } 
  return sanditizedTmnt
}

/**
 * valildates a tournament data object
 * 
 * @param tmnt - tournament data to check
 * @returns - {ErrorCode.MissingData, ErrorCode.InvalidData, ErrorCode.None, ErrorCode.OtherError} 
 */
export const validateTmnt = (tmnt: tmntType): ErrorCode => { 

  try {
    const errCode = gotTmntData(tmnt)
    if (errCode !== ErrorCode.None) {
      return errCode
    }
    return validTmntData(tmnt)
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const exportedForTesting = {
  gotTmntData,
  validTmntData 
}