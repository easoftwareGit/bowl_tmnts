import { isValidBtDbId, ErrorCode, maxMoney, validSortOrder } from "@/lib/validation";
import { sanitize, sanitizeCurrency } from "@/lib/sanitize";
import { validMoney } from "@/lib/currency/validate";
import { brktType, idTypes } from "@/lib/types/types";
import { initBrkt } from "@/db/initVals";

/**
 * checks if brkt object has missing data - DOES NOT SANITIZE OR VALIDATE
 *
 * @param brkt - brkt to check for missing data
 * @returns {ErrorCode.MissingData | ErrorCode.None | ErrorCode.OtherError} - error code
 */
const gotPotData = (brkt: brktType): ErrorCode => {
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
      !validMoney(brkt.first, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(brkt.second, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      !validMoney(brkt.admin, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
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