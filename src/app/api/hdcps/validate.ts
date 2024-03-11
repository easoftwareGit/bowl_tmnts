import {
  isValidBtDbId,
  ErrorCode,
  minHdcpFrom,
  maxHdcpFrom,
} from "@/lib/validation";

export type hdcpToCheck = {
  div_id: string;
  hdcp_from: number;
  int_hdcp: boolean;
  game: boolean;
};

export function gotHdcpData(hdcp: hdcpToCheck): ErrorCode {
  try {
    if (
      !hdcp.div_id
      || (typeof hdcp.hdcp_from !== "number")
      || (typeof hdcp.int_hdcp !== "boolean")
      || (typeof hdcp.game !== "boolean")
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validHdcpData(hdcp: hdcpToCheck): ErrorCode {
  try {
    if (hdcp.div_id && !isValidBtDbId(hdcp.div_id)) {
      return ErrorCode.InvalidData;
    }
    if (typeof hdcp.hdcp_from === 'number' && (hdcp.hdcp_from < minHdcpFrom || hdcp.hdcp_from > maxHdcpFrom)) {
      return ErrorCode.InvalidData;
    }    
    if (!(typeof hdcp.int_hdcp === 'boolean' || typeof hdcp.int_hdcp === 'undefined')) {
      return ErrorCode.InvalidData;
    }
    if (!(typeof hdcp.game === 'boolean' || typeof hdcp.game === 'undefined')) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validateHdcp(hdcp: hdcpToCheck): ErrorCode { 
  try {
    const errCode = gotHdcpData(hdcp)
    if (errCode !== ErrorCode.None) {
      return errCode
    }    
    return validHdcpData(hdcp)
  } catch (error) {
    return ErrorCode.OtherError
  }
}
