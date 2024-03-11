import {
  isValidBtDbId,
  maxEventLength,
  minHdcpPer,
  maxHdcpPer,
  minSortOrder,
  maxSortOrder,
  ErrorCode,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";

export type divToCheck = {
  event_id: string;
  div_name: string;
  hdcp_per: number | undefined;
  sort_order: number | undefined;
};

export function gotDivData(div: divToCheck): ErrorCode {
  try {
    if (
      !div.event_id
      || !sanitize(div.div_name)
      || (typeof div.hdcp_per !== 'number')
      || (typeof div.sort_order !== 'number')
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validDivData(div: divToCheck): ErrorCode {
  try {
    if (div.event_id && !isValidBtDbId(div.event_id)) {
      return ErrorCode.InvalidData;
    }
    if (
      div.div_name &&
      sanitize(div.div_name).length > maxEventLength
    ) {
      return ErrorCode.InvalidData;
    }
    if (typeof div.hdcp_per === 'number' && (div.hdcp_per < minHdcpPer || div.hdcp_per > maxHdcpPer)) {
      return ErrorCode.InvalidData;
    }
    if (typeof div.sort_order === 'number' && (div.sort_order < minSortOrder || div.sort_order > maxSortOrder)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validateDiv(div: divToCheck): ErrorCode { 
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
