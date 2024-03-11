import {
  isValidBtDbId,
  maxEventLength,
  minGames,
  maxGames,
  minSortOrder,
  maxSortOrder,
  ErrorCode,
  validTime,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { isValid } from "date-fns";

export type squadToCheck = {
  event_id: string;
  squad_name: string;
  squad_date: string;
  squad_time: string;
  games: number;
  sort_order: number;
};

export function gotSquadData(squad: squadToCheck): ErrorCode {
  try {
    // squad_time can be blank
    if (
      !squad.event_id ||
      !sanitize(squad.squad_name) ||
      !squad.squad_date ||
      !(typeof squad.squad_time === "string" || !squad.squad_time) ||
      typeof squad.games !== "number" ||
      typeof squad.sort_order !== "number"
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validSquadData(squad: squadToCheck): ErrorCode {
  try {
    if (squad.event_id && !isValidBtDbId(squad.event_id)) {
      return ErrorCode.InvalidData;
    }
    if (
      squad.squad_name &&
      sanitize(squad.squad_name).length > maxEventLength
    ) {
      return ErrorCode.InvalidData;
    }
    if (squad.squad_date && !isValid(new Date(squad.squad_date))) {
      return ErrorCode.InvalidData;
    }
    if (squad.squad_time && !validTime(squad.squad_time)) {
      return ErrorCode.InvalidData;
    }
    if (
      typeof squad.games === "number" &&
      (squad.games < minGames || squad.games > maxGames)
    ) {
      return ErrorCode.InvalidData;
    }
    if (
      typeof squad.sort_order === "number" &&
      (squad.sort_order < minSortOrder || squad.sort_order > maxSortOrder)
    ) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validateSquad(squad: squadToCheck): ErrorCode {
  try {
    const errCode = gotSquadData(squad);
    if (errCode !== ErrorCode.None) {
      return errCode;
    }
    return validSquadData(squad);
  } catch (error) {
    return ErrorCode.OtherError;
  }
}
