import {
  isValidBtDbId,
  maxEventLength,
  minGames,
  maxGames,
  ErrorCode,
  validTime,
  minLane,
  maxStartLane,
  isOdd,
  isEven,
  maxLaneCount,
  validSortOrder,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { isValid, startOfDay } from "date-fns";
import { squadType, idTypes } from "@/lib/types/types";
import { initSquad } from "@/db/initVals";

/**
 * checks if squad object has missing data - DOES NOT SANITIZE OR VALIDATE
 * 
 * @param squad - squad to check for missing data
 * @returns {ErrorCode.MissingData | ErrorCode.None | ErrorCode.OtherError} - error code
 */
const gotSquadData =(squad: squadType): ErrorCode => {
  try {
    // squad_time can be blank
    if (
      !squad.event_id
      || !sanitize(squad.squad_name)
      || (typeof squad.games !== "number")
      || (typeof squad.starting_lane !== "number")
      || (typeof squad.lane_count !== "number")
      || !squad.squad_date
      || (typeof squad.sort_order !== "number")           
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export const validSquadName = (squadName: string): boolean => { 
  const sanitized = sanitize(squadName);
  return (sanitized.length > 0 && sanitized.length <= maxEventLength)
}
export const validGames = (games: number): boolean => {
  if (!games) return false;
  return Number.isInteger(games) &&
    (games >= minGames && games <= maxGames);
}
export const validStartingLane = (startingLane: number): boolean => {
  if (!startingLane) return false;
  return Number.isInteger(startingLane) &&
    (startingLane >= minLane && startingLane <= maxStartLane) &&
    isOdd(startingLane);
}
export const validLaneCount = (laneCount: number): boolean => { 
  if (!laneCount) return false
  return Number.isInteger(laneCount) &&
    (laneCount >= 2 && laneCount <= maxStartLane + 1) &&
    isEven(laneCount);
}
export const validSquadDate = (squadDateStr: string): boolean => { 
  if (!squadDateStr) return false
  const squadDate = startOfDay(new Date(squadDateStr))
  return isValid(squadDate)
}
export const validSquadTime = (squadTimeStr: string | null): boolean => { 
  if (typeof squadTimeStr === 'undefined') return false  
  if (!squadTimeStr) return true
  return validTime(squadTimeStr)
}

/**
 * checks in the combo of startingLane and laneCount is valid
 * 
 * @param startingLane - the starting lane 
 * @param laneCount - the number of lanes
 * @returns {boolean} - true if (startingLane - 1) + laneCount <= maxLaneCount
 */
export const validLaneConfig = (startingLane: number, laneCount: number): boolean => { 
  if (!validStartingLane(startingLane) || !validLaneCount(laneCount)) return false
  return ((startingLane - 1) + laneCount <= maxLaneCount) 
}
/**
 * checks if foreign key is valid
 * 
 * @param FkId - foreign key 
 * @param idType - id type - 'evt'
 * @returns {boolean} - true if foreign key is valid
 */
export const validEventFkId = (FkId: string, idType: idTypes): boolean => { 

  if (!(FkId) || !isValidBtDbId(FkId, idType)) {
    return false
  }
  return (idType === 'evt')
}

/**
 * checks if squad data is valid
 * 
 * @param squad - squad object to validate
 * @returns {ErrorCode.None | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
const validSquadData = (squad: squadType): ErrorCode => {  
  try {
    if (!squad) return ErrorCode.InvalidData;
    if (!isValidBtDbId(squad.event_id, 'evt')) {
      return ErrorCode.InvalidData;
    }
    if (!validSquadName(squad.squad_name)) {
      return ErrorCode.InvalidData;
    }
    if (!validGames(squad.games)) {
      return ErrorCode.InvalidData;
    }
    if (!validLaneConfig(squad.starting_lane, squad.lane_count)) {
      return ErrorCode.InvalidData;
    }
    if (!validSquadDate(squad.squad_date)) {
      return ErrorCode.InvalidData;
    }
    if (!validSquadTime(squad.squad_time)) {
      return ErrorCode.InvalidData;
    }
    if (!validSortOrder(squad.sort_order)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

/**
 * sanitizes a squad object 
 * 
 * @param squad - squad to sanitize
 * @returns {squadType} - squad object with sanitized data
 */
export const sanitizeSquad = (squad: squadType): squadType => { 
  if (!squad) return null as any
  const sanitizedSquad = { ...initSquad }
  sanitizedSquad.squad_name = sanitize(squad.squad_name)
  if (validEventFkId(squad.event_id, 'evt')) {
    sanitizedSquad.event_id = squad.event_id
  }
  if (validGames(squad.games)) {
    sanitizedSquad.games = squad.games
  }
  if (validLaneConfig(squad.starting_lane, squad.lane_count)) {
    sanitizedSquad.starting_lane = squad.starting_lane  
    sanitizedSquad.lane_count = squad.lane_count
  }
  if (validSquadDate(squad.squad_date)) {
    sanitizedSquad.squad_date = squad.squad_date
  }
  if (validSquadTime(squad.squad_time)) {
    sanitizedSquad.squad_time = squad.squad_time
  }
  if (validSortOrder(squad.sort_order)) {
    sanitizedSquad.sort_order = squad.sort_order
  }  
  return sanitizedSquad    
}

/**
 * validates a squad object
 * 
 * @param squad - squad to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
export function validateSquad(squad: squadType): ErrorCode { 
  try {
    const errCode = gotSquadData(squad)
    if (errCode !== ErrorCode.None) {
      return errCode
    }    
    return validSquadData(squad)
  } catch (error) {
    return ErrorCode.OtherError
  }
}

export const exportedForTesting = {
  gotSquadData, 
  validSquadData 
}