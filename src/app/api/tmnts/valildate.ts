import { isValidBtDbId, maxTmntNameLength, ErrorCode } from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { startOfDay, isValid } from "date-fns";

export type tmntToCheck = {
  tmnt_name: string,
  start_date: string,
  end_date: string,
  user_id: string,
  bowl_id: string
}

export function gotTmntData(tmnt: tmntToCheck): ErrorCode { 

  try {
    if (!sanitize(tmnt.tmnt_name)
      || !tmnt.start_date
      || !tmnt.end_date
      || !tmnt.user_id
      || !tmnt.bowl_id) {
      return ErrorCode.MissingData
    }
    return ErrorCode.None    
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export function validTmntData(tmnt: tmntToCheck): ErrorCode { 

  try {           
    if (tmnt.tmnt_name && sanitize(tmnt.tmnt_name).length > maxTmntNameLength) {
      return ErrorCode.InvalidData
    }
    if (tmnt.user_id && !isValidBtDbId(tmnt.user_id)) {
      return ErrorCode.InvalidData
    }
    if (tmnt.bowl_id && !isValidBtDbId(tmnt.bowl_id)) {
      return ErrorCode.InvalidData
    }
    // have to have either both dates or niether date
    if (!tmnt.start_date && tmnt.end_date || tmnt.start_date && !tmnt.end_date) {
      return ErrorCode.InvalidData
    }
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

export function validateTmnt(tmnt: tmntToCheck): ErrorCode { 

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
