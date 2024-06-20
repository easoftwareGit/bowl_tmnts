import {
  isValidBtDbId,
  minLane,
  maxLaneCount,
  ErrorCode,    
} from "@/lib/validation";
import { idTypes, laneType } from "@/lib/types/types";
import { initLane } from "@/db/initVals";

/**
 * checks if lane object has missing data - DOES NOT SANITIZE OR VALIDATE
 * 
 * @param lane - the lane object to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData |  ErrorCode.OtherError }
 */
const gotLaneData = (lane: laneType): ErrorCode => {
  try {
    if(!lane) return ErrorCode.MissingData;
    if (
      !lane.squad_id      
      || (typeof lane.lane_number !== 'number')
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export const validLaneNumber = (laneNumber: number): boolean => {
  if (!laneNumber) return false
  return Number.isInteger(laneNumber) &&
    (laneNumber >= minLane && laneNumber <= maxLaneCount);
}

/**
 * checks if foreign key is valid
 * 
 * @param FkId - foreign key 
 * @param idType - id type - 'sqd'
 * @returns {boolean} - true if foreign key is valid
 */
export const validEventFkId = (FkId: string, idType: idTypes): boolean => { 

  if (!(FkId) || !isValidBtDbId(FkId, idType)) {
    return false
  }
  return (idType === 'sqd')
}

/**
 * checks if lane data is valid
 * 
 * @param lane - lane object to validate
 * @returns {ErrorCode.None | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
const validLaneData = (lane: laneType): ErrorCode => {  
  try {
    if (!lane) return ErrorCode.InvalidData;
    if (!isValidBtDbId(lane.squad_id, 'sqd')) {
      return ErrorCode.InvalidData;
    }
    if (!validLaneNumber(lane.lane_number)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

/**
 * sanitizes an lane object 
 * 
 * @param lane - lane to sanitize
 * @returns {laneType} - lane object with sanitized data
 */
export const sanitizeLane = (lane: laneType): laneType => { 
  if (!lane) return null as any
  const sanitizedLane = { ...initLane }  
  if (validEventFkId(lane.squad_id, 'sqd')) {
    sanitizedLane.squad_id = lane.squad_id
  }
  if (validLaneNumber(lane.lane_number)) {
    sanitizedLane.lane_number = lane.lane_number
  }
  return sanitizedLane    
}

/**
 * validates a lane object - DOES NOT SANITIZE
 * 
 * @param lane - lane to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
export function validateLane(lane: laneType): ErrorCode { 
  try {
    const errCode = gotLaneData(lane)
    if (errCode !== ErrorCode.None) {
      return errCode
    }    
    return validLaneData(lane)
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const exportedForTesting = {
  gotLaneData, 
  validLaneData 
}