import {
  isValidBtDbId,
  ErrorCode,
  maxMoney,
  validSortOrder,
  minGames,
  maxGames,
} from "@/lib/validation";
import { sanitizeCurrency } from "@/lib/sanitize";
import { validMoney } from "@/lib/currency/validate";
import { brktType, idTypes } from "@/lib/types/types";
import { defaultBrktGames, defaultBrktPlayers, initBrkt } from "@/db/initVals";

/**
 * checks if brkt object has missing data - DOES NOT SANITIZE OR VALIDATE
 *
 * @param brkt - brkt to check for missing data
 * @returns {ErrorCode.MissingData | ErrorCode.None | ErrorCode.OtherError} - error code
 */
const gotBrktData = (brkt: brktType): ErrorCode => {
  try {
    if (!brkt) return ErrorCode.MissingData;
    if (
      !brkt.div_id ||
      !brkt.squad_id ||
      !validMoney(brkt.fee, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      typeof brkt.start !== "number" ||
      typeof brkt.games !== "number" ||
      typeof brkt.players !== "number" ||
      !validMoney(brkt.fee, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(
        brkt.first,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      ) ||
      !validMoney(
        brkt.second,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      ) ||
      !validMoney(
        brkt.admin,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      ) ||
      !validMoney(brkt.fsa, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      typeof brkt.sort_order !== "number"
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
};

export const validStart = (start: number): boolean => {
  if (!start) return false;
  return Number.isInteger(start) && start >= minGames && start <= maxGames;
};
export const validGames = (games: number): boolean => {
  if (!games) return false;
  return (
    Number.isInteger(games) &&
    games >= defaultBrktGames &&
    games <= defaultBrktGames
  );
};
export const validPlayers = (players: number): boolean => {
  if (!players) return false;
  return (
    Number.isInteger(players) &&
    players >= defaultBrktPlayers &&
    players <= defaultBrktPlayers
  );
};
export const validBrktMoney = (moneyStr: string): boolean => {
  if (!moneyStr) return false;
  return validMoney(moneyStr, 1, maxMoney);
};

/**
 * checks if (fee * players) = (first + second + admin) and
 *  first = fee * 5
 *  second = fee * 2
 *  admin = fee
 *  (fee * players) = fsa
 * @param brkt - brkt to check
 * @returns {boolean} - true if entry equals lpox
 */
export const validFsa = (brkt: brktType): boolean => {
  if (!brkt) return false;
  try {
    const fee = Number(brkt.fee);
    const first = Number(brkt.first);
    const players = brkt.players;
    const second = Number(brkt.second);
    const admin = Number(brkt.admin);
    const fsa = Number(brkt.fsa);
    if (
      isNaN(fee) ||
      isNaN(first) ||
      isNaN(second) ||
      isNaN(admin) ||
      isNaN(fsa) ||
      isNaN(players)
    ) {
      return false;
    }
    return (
      fee * players === first + second + admin &&
      fee * 5 === first &&
      fee * 2 === second &&
      fee === admin &&
      fee * players === fsa
    );
  } catch (error) {
    return false;
  }
};

/**
 * checks if foreign key is valid
 *
 * @param FkId - foreign key
 * @param idType - id type - 'div' or 'sqd'
 * @returns {boolean} - true if foreign key is valid
 */
export const validBrktFkId = (FkId: string, idType: idTypes): boolean => {
  if (!FkId || !isValidBtDbId(FkId, idType)) {
    return false;
  }
  return idType === "div" || idType === "sqd";
};

/**
 * checks if brkt data is valid
 *
 * @param brkt - brkt object to validate
 * @returns {ErrorCode.None | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
const validBrktData = (brkt: brktType): ErrorCode => {
  try {
    if (!brkt) return ErrorCode.InvalidData;
    if (!isValidBtDbId(brkt.div_id, "div")) {
      return ErrorCode.InvalidData;
    }
    if (!isValidBtDbId(brkt.squad_id, "sqd")) {
      return ErrorCode.InvalidData;
    }
    if (!validBrktMoney(brkt.fee)) {
      return ErrorCode.InvalidData;
    }
    if (!validStart(brkt.start)) {
      return ErrorCode.InvalidData;
    }
    if (!validGames(brkt.games)) {
      return ErrorCode.InvalidData;
    }
    if (!validPlayers(brkt.players)) {
      return ErrorCode.InvalidData;
    }
    if (!validBrktMoney(brkt.first)) {
      return ErrorCode.InvalidData;
    }
    if (!validBrktMoney(brkt.second)) {
      return ErrorCode.InvalidData;
    }
    if (!validBrktMoney(brkt.admin)) {
      return ErrorCode.InvalidData;
    }
    if (!validBrktMoney(brkt.fsa)) {
      return ErrorCode.InvalidData;
    }
    if (!validFsa(brkt)) {
      return ErrorCode.InvalidData;
    }
    if (!validSortOrder(brkt.sort_order)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
};

/**
 * sanitizes a brkt object
 *
 * @param brkt - brkt to sanitize
 * @returns {brktType} - brkt object with sanitized data
 */
export const sanitizeBrkt = (brkt: brktType): brktType => {
  if (!brkt) return null as any;
  const sanitizedBrkt = { ...initBrkt };
  if (validBrktFkId(brkt.div_id, "div")) {
    sanitizedBrkt.div_id = brkt.div_id;
  }
  if (validBrktFkId(brkt.squad_id, "sqd")) {
    sanitizedBrkt.squad_id = brkt.squad_id;
  }
  if (validStart(brkt.start)) {
    sanitizedBrkt.start = brkt.start;
  }
  if (validGames(brkt.games)) {
    sanitizedBrkt.games = brkt.games;
  }
  if (validPlayers(brkt.players)) {
    sanitizedBrkt.players = brkt.players;
  }
  // sanitizeCurrency removes trailing zeros
  if (validBrktMoney(brkt.fee)) {
    sanitizedBrkt.fee = sanitizeCurrency(brkt.fee);
  }
  if (validBrktMoney(brkt.first)) {
    sanitizedBrkt.first = sanitizeCurrency(brkt.first);
  }
  if (validBrktMoney(brkt.second)) {
    sanitizedBrkt.second = sanitizeCurrency(brkt.second);
  }
  if (validBrktMoney(brkt.admin)) {
    sanitizedBrkt.admin = sanitizeCurrency(brkt.admin);
  }
  if (validBrktMoney(brkt.fsa)) {
    sanitizedBrkt.fsa = sanitizeCurrency(brkt.fsa);
  }
  if (validSortOrder(brkt.sort_order)) {
    sanitizedBrkt.sort_order = brkt.sort_order;
  }
  return sanitizedBrkt;
};

/**
 * validates a brkt object
 *
 * @param brkt - brkt to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
export function validateBrkt(brkt: brktType): ErrorCode {
  try {
    const errCode = gotBrktData(brkt);
    if (errCode !== ErrorCode.None) {
      return errCode;
    }
    return validBrktData(brkt);
  } catch (err) {
    return ErrorCode.OtherError;
  }
}

export const exportedForTesting = {
  gotBrktData,
  validBrktData,
};
