import {
  isValidBtDbId,
  maxEventLength,
  minTeamSize,
  maxTeamSize,
  minGames,
  maxGames,
  minSortOrder,
  maxSortOrder,
  ErrorCode,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";

export type eventToCheck = {
  tmnt_id: string;
  event_name: string;
  team_size: number;
  games: number;
  sort_order: number;
};

export function gotEventData(event: eventToCheck): ErrorCode {
  try {
    if (
      !event.tmnt_id
      || !sanitize(event.event_name)
      || (typeof event.team_size !== 'number')
      || (typeof event.games !== 'number')
      || (typeof event.sort_order !== 'number')      
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validEventData(event: eventToCheck): ErrorCode {
  try {
    if (event.tmnt_id && !isValidBtDbId(event.tmnt_id)) {
      return ErrorCode.InvalidData;
    }
    if (
      event.event_name &&
      sanitize(event.event_name).length > maxEventLength
    ) {
      return ErrorCode.InvalidData;
    }
    if (typeof event.team_size === 'number' && (event.team_size < minTeamSize || event.team_size > maxTeamSize)) {
      return ErrorCode.InvalidData;
    }
    if (typeof event.games === 'number' && (event.games < minGames || event.games > maxGames)) {
      return ErrorCode.InvalidData;
    }
    if (typeof event.sort_order === 'number' && (event.sort_order < minSortOrder || event.sort_order > maxSortOrder)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validateEvent(event: eventToCheck): ErrorCode { 
  try {
    const errCode = gotEventData(event)
    if (errCode !== ErrorCode.None) {
      return errCode
    }    
    return validEventData(event)
  } catch (error) {
    return ErrorCode.OtherError
  }
}
