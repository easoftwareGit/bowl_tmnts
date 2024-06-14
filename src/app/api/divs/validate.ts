import {
  isValidBtDbId,
  maxEventLength,
  minHdcpPer,
  maxHdcpPer,
  ErrorCode,
  minHdcpFrom,
  maxHdcpFrom,
  validSortOrder,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { HdcpForTypes, idTypes } from "@/lib/types/types";
import { divType } from "@/lib/types/types";
import { initDiv } from "@/db/initVals";

const isHdcpForType = (value: any): value is HdcpForTypes => {
  return value === "Game" || value === "Series";
}

/**
 * checks if div object has data
 * 
 * @param div - div object to check
 * @returns { ErrorCode.None | ErrorCode.MissingData | ErrorCode.OtherError } 
 */
const gotDivData = (div: divType): ErrorCode => {
  try {
    if (!div.tmnt_id
      || !sanitize(div.div_name)
      || (typeof div.hdcp_per !== 'number')
      || (typeof div.hdcp_from !== 'number')
      || (typeof div.int_hdcp !== 'boolean')
      || (!isHdcpForType(div.hdcp_for))
      || (typeof div.sort_order !== 'number')
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export const validDivName = (divName: string): boolean => {
  if (!divName) return false
  const sanitized = sanitize(divName);
  return (sanitized.length > 0 && sanitized.length <= maxEventLength);
}
export const validHdcpPer = (hdcpPer: number): boolean => {
  if (typeof hdcpPer !== 'number') return false  
  return (hdcpPer >= minHdcpPer && hdcpPer <= maxHdcpPer);
}
export const validHdcpFrom = (hdcpFrom: number): boolean => {
  if (typeof hdcpFrom !== 'number' || !Number.isInteger(hdcpFrom)) return false
  return (hdcpFrom >= minHdcpFrom && hdcpFrom <= maxHdcpFrom);
}
export const validIntHdcp = (intHdcp: boolean): boolean => {
  if (typeof intHdcp !== 'boolean') return false
  return (intHdcp === true || intHdcp === false);
}
export const validHdcpFor = (hdcpFor: string): boolean => {
  if (typeof hdcpFor !== 'string') return false
  return isHdcpForType(hdcpFor);
}

/**
 * checks if foreign key is valid
 * 
 * @param FkId - foreign key 
 * @param idType - id type - 'usr' or 'bwl'
 * @returns boolean - true if foreign key is valid
 */
export const validDivFkId = (FkId: string, idType: idTypes): boolean => { 
  if (!(FkId) || !isValidBtDbId(FkId, idType)) {
    return false
  }
  return (idType === 'tmt')
}

/**
 * checks if div data is valid 
 * 
 * @param div - div data to validate
 * @returns {ErrorCode.None | ErrorCode.InvalidData, ErrorCode.OtherError}
 */
const validDivData = (div: divType): ErrorCode => {
  try {
    if (!div) return ErrorCode.InvalidData;
    if (!validDivFkId(div.tmnt_id, 'tmt')) {
      return ErrorCode.InvalidData;
    }
    if (!validDivName(div.div_name)) {
      return ErrorCode.InvalidData;
    }
    if (!validHdcpPer(div.hdcp_per)) {
      return ErrorCode.InvalidData;
    }
    if (!validHdcpFrom(div.hdcp_from)) {
      return ErrorCode.InvalidData;
    }
    if (!validIntHdcp(div.int_hdcp)) {
      return ErrorCode.InvalidData;
    }
    if (!validHdcpFor(div.hdcp_for)) {
      return ErrorCode.InvalidData;
    }
    if (!validSortOrder(div.sort_order)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

/**
 * sanitize a div object
 * 
 * @param div - div data to sanitize
 * @returns { divType } - sanitized div
 */
export const sanitizeDiv = (div: divType): divType => {
  if (!div) return null as any;
  const sanitizedDiv = { ...initDiv }
  if (validDivFkId(div.tmnt_id, 'tmt')) {
    sanitizedDiv.tmnt_id = div.tmnt_id
  }
  sanitizedDiv.div_name = sanitize(div.div_name)
  if (validHdcpPer(div.hdcp_per)) {
    sanitizedDiv.hdcp_per = div.hdcp_per
  }
  if (validHdcpFrom(div.hdcp_from)) {
    sanitizedDiv.hdcp_from = div.hdcp_from
  }
  if (validIntHdcp(div.int_hdcp)) {
    sanitizedDiv.int_hdcp = div.int_hdcp
  }
  if (validHdcpFor(div.hdcp_for)) {
    sanitizedDiv.hdcp_for = div.hdcp_for
  }
  if (validSortOrder(div.sort_order)) {
    sanitizedDiv.sort_order = div.sort_order
  }
  return sanitizedDiv
}

/**
 * checks if div data is valid 
 * 
 * @param div - div data to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError}
 */
export function validateDiv(div: divType): ErrorCode { 
  try {
    const errCode = gotDivData(div)
    if (errCode !== ErrorCode.None) {
      return errCode
    }    
    return validDivData(div)
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const exportedForTesting = {
  gotDivData,  
  validDivData
}
