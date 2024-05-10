import { isValidBtDbId, maxTmntNameLength, ErrorCode } from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { startOfDay, isValid } from "date-fns";
import { tmntType } from "@/lib/types/types";
import { initTmnt } from "@/db/initVals";

/**
 * checks for required data and returns error code if missing 
 * 
 * @param tmnt - tournament data to check
 * @returns - {ErrorCode.MissingData, ErrorCode.None, ErrorCode.OtherError}
 */
const gotTmntData = (tmnt: tmntType): ErrorCode =>{ 

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
  return (tmntName.length > 0 && sanitize(tmntName).length <= maxTmntNameLength)
}

/**
 * checks if tournament data is valid
 * 
 * @param tmnt - tournament data to check
 * @returns - {ErrorCode.InvalidData, ErrorCode.None, ErrorCode.OtherError}
 */
const validTmntData = (tmnt: tmntType): ErrorCode => { 

  try {           
    if (!validTmntName(tmnt.tmnt_name)) {
      return ErrorCode.InvalidData
    }
    // if both start and end dates, end cannot be before start
    if (tmnt.start_date && tmnt.end_date) {
      const startDate = startOfDay(new Date(tmnt.start_date))
      const endDate = startOfDay(new Date(tmnt.end_date))
      if (!isValid(startDate) || !isValid(endDate)) {
        return ErrorCode.InvalidData
      }       
      if (endDate < startDate) {
        return ErrorCode.InvalidData
      }
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const sanitizeTmnt = (tmnt: tmntType): tmntType => { 

  const sanditizedTmnt: tmntType = {
    ...initTmnt
  }  
  sanditizedTmnt.tmnt_name = sanitize(tmnt.tmnt_name)
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
