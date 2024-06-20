import {
  isValidBtDbId,
  maxEventLength,
  minTeamSize,
  maxTeamSize,
  minGames,
  maxGames,
  ErrorCode,
  maxMoney,
  validSortOrder,
} from "@/lib/validation";
import { sanitize, sanitizeCurrency } from "@/lib/sanitize";
import { validMoney } from "@/lib/currency/validate";
import { eventType, idTypes } from "@/lib/types/types";
import { initEvent } from "@/db/initVals";

/**
 * checks if event object has missing data - DOES NOT SANITIZE OR VALIDATE
 *
 * @param event - event to check for missing data
 * @returns {ErrorCode.MissingData | ErrorCode.None | ErrorCode.OtherError} - error code
 */
const gotEventData = (event: eventType): ErrorCode => {
  try {
    if (!event) return ErrorCode.MissingData;
    if (
      !event.tmnt_id ||
      !sanitize(event.event_name) ||
      typeof event.team_size !== "number" ||
      typeof event.games !== "number" ||
      !validMoney(event.added_money, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(event.entry_fee, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(event.lineage, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(event.prize_fund, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(event.other, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(event.expenses, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(event.lpox, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      typeof event.sort_order !== "number"
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
};

export const validEventName = (eventName: string): boolean => {
  if (!eventName) return false;
  const sanitized = sanitize(eventName);
  return sanitized.length > 0 && sanitized.length <= maxEventLength;
};
export const validTeamSize = (teamSize: number): boolean => {
  if (!teamSize) return false;
  return Number.isInteger(teamSize) && teamSize >= minTeamSize && teamSize <= maxTeamSize;
};
export const validGames = (games: number): boolean => {
  if (!games) return false;
  return Number.isInteger(games) && games >= minGames && games <= maxGames;
};
export const validEventMoney = (moneyStr: string): boolean => {
  if (!moneyStr) return false;
  return validMoney(moneyStr, 0, maxMoney);
};

/**
 * checks if entry equals lpox and
 *   entry equals lineage + prize_fund + other + expenses
 *
 * @param event - event to check
 * @returns {boolean} - true if entry equals lpox
 */
export const entryFeeEqualsLpox = (event: eventType): boolean => {
  if (!event) return false;
  try {
    const entryFee = Number(event.entry_fee);
    const lineage = Number(event.lineage);
    const prizeFund = Number(event.prize_fund);
    const other = Number(event.other);
    const expenses = Number(event.expenses);
    const lpox = Number(event.lpox);
    if (
      isNaN(entryFee) ||
      isNaN(lineage) ||
      isNaN(prizeFund) ||
      isNaN(other) ||
      isNaN(expenses) ||
      isNaN(lpox)
    ) {
      return false;
    }
    return entryFee === lineage + prizeFund + other + expenses && entryFee === lpox;
  } catch (error) {
    return false;
  }
};

/**
 * checks if foreign key is valid
 *
 * @param FkId - foreign key
 * @param idType - id type - 'tmt'
 * @returns {boolean} - true if foreign key is valid
 */
export const validEventFkId = (FkId: string, idType: idTypes): boolean => {
  if (!FkId || !isValidBtDbId(FkId, idType)) {
    return false;
  }
  return idType === "tmt";
};

/**
 * checks if event data is valid
 *
 * @param event - event object to validate
 * @returns {ErrorCode.None | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
const validEventData = (event: eventType): ErrorCode => {
  try {
    if (!event) return ErrorCode.InvalidData;
    if (!isValidBtDbId(event.tmnt_id, "tmt")) {
      return ErrorCode.InvalidData;
    }
    if (!validEventName(event.event_name)) {
      return ErrorCode.InvalidData;
    }
    if (!validTeamSize(event.team_size)) {
      return ErrorCode.InvalidData;
    }
    if (!validGames(event.games)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.added_money)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.entry_fee)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.lineage)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.prize_fund)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.other)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.expenses)) {
      return ErrorCode.InvalidData;
    }
    if (!validEventMoney(event.lpox)) {
      return ErrorCode.InvalidData;
    }
    if (!validSortOrder(event.sort_order)) {
      return ErrorCode.InvalidData;
    }
    if (!entryFeeEqualsLpox(event)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
};

/**
 * sanitizes an event object
 *
 * @param event - event to sanitize
 * @returns {eventType} - event object with sanitized data
 */
export const sanitizeEvent = (event: eventType): eventType => {
  if (!event) return null as any;
  const sanitizedEvent = { ...initEvent };
  sanitizedEvent.event_name = sanitize(event.event_name);
  if (validEventFkId(event.tmnt_id, "tmt")) {
    sanitizedEvent.tmnt_id = event.tmnt_id;
  }
  if (validTeamSize(event.team_size)) {
    sanitizedEvent.team_size = event.team_size;
  }
  if (validGames(event.games)) {
    sanitizedEvent.games = event.games;
  }
  // sanitizeCurrency removes trailing zeros
  if (validEventMoney(event.added_money)) {
    sanitizedEvent.added_money = sanitizeCurrency(event.added_money);
  }
  if (validEventMoney(event.entry_fee)) {
    sanitizedEvent.entry_fee = sanitizeCurrency(event.entry_fee);
  }
  if (validEventMoney(event.lineage)) {
    sanitizedEvent.lineage = sanitizeCurrency(event.lineage);
  }
  if (validEventMoney(event.prize_fund)) {
    sanitizedEvent.prize_fund = sanitizeCurrency(event.prize_fund);
  }
  if (validEventMoney(event.other)) {
    sanitizedEvent.other = sanitizeCurrency(event.other);
  }
  if (validEventMoney(event.expenses)) {
    sanitizedEvent.expenses = sanitizeCurrency(event.expenses);
  }
  if (validEventMoney(event.lpox)) {
    sanitizedEvent.lpox = sanitizeCurrency(event.lpox);
  }
  if (validSortOrder(event.sort_order)) {
    sanitizedEvent.sort_order = event.sort_order;
  }
  return sanitizedEvent;
};

/**
 * validates an event object
 *
 * @param event - event to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
export function validateEvent(event: eventType): ErrorCode {
  try {
    const errCode = gotEventData(event);
    if (errCode !== ErrorCode.None) {
      return errCode;
    }
    return validEventData(event);
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export const exportedForTesting = {
  gotEventData,
  validEventData,
};
