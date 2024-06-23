import { isValidBtDbId, ErrorCode, maxMoney, validSortOrder } from "@/lib/validation";
import { sanitize, sanitizeCurrency } from "@/lib/sanitize";
import { validMoney } from "@/lib/currency/validate";
import { potType, PotCategories, idTypes } from "@/lib/types/types";
import { initPot } from "@/db/initVals";

/**
 * checks if pot object has missing data - DOES NOT SANITIZE OR VALIDATE
 *
 * @param pot - pot to check for missing data
 * @returns {ErrorCode.MissingData | ErrorCode.None | ErrorCode.OtherError} - error code
 */
const gotPotData = (pot: potType): ErrorCode => {
  try {
    if (!pot) return ErrorCode.MissingData;
    if (
      !pot.div_id ||
      !pot.squad_id ||
      !sanitize(pot.pot_type) ||
      !validMoney(pot.fee, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) ||
      typeof pot.sort_order !== "number"
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
};

export const validPotType = (pot_type: PotCategories): boolean => {
  if (!pot_type) return false;
  const sanitized = sanitize(pot_type);
  // "" is inclided in PotCategories type, but is not a valid value
  return (sanitized === 'Game' || sanitized === 'Last Game' || sanitized === 'Series');  
}
export const validPotMoney = (moneyStr: string): boolean => {
  if (!moneyStr) return false;
  return validMoney(moneyStr, 1, maxMoney);
};

/**
 * checks if foreign key is valid
 *
 * @param FkId - foreign key
 * @param idType - id type - 'div' or 'sqd'
 * @returns {boolean} - true if foreign key is valid
 */
export const validPotFkId = (FkId: string, idType: idTypes): boolean => {
  if (!FkId || !isValidBtDbId(FkId, idType)) {
    return false;
  }
  return (idType === "div" || idType === "sqd");
};

/**
 * checks if pot data is valid
 *
 * @param pot - pot object to validate
 * @returns {ErrorCode.None | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
const validPotData = (pot: potType): ErrorCode => {
  try {
    if (!pot) return ErrorCode.InvalidData;
    if (!isValidBtDbId(pot.div_id, "div")) {
      return ErrorCode.InvalidData;
    }
    if (!isValidBtDbId(pot.squad_id, "sqd")) {
      return ErrorCode.InvalidData;
    }
    if (!validPotType(pot.pot_type)) {
      return ErrorCode.InvalidData;
    }
    if (!validPotMoney(pot.fee)) {
      return ErrorCode.InvalidData;
    }
    if (!validSortOrder(pot.sort_order)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
};

/**
 * sanitizes a pot object
 *
 * @param pot - pot to sanitize
 * @returns {potType} - pot object with sanitized data
 */
export const sanitizePot = (pot: potType): potType => {
  if (!pot) return null as any;
  const sanitizedPot = { ...initPot };    
  if (validPotFkId(pot.div_id, "div")) {
    sanitizedPot.div_id = pot.div_id
  };
  if (validPotFkId(pot.squad_id, "sqd")) {
    sanitizedPot.squad_id = pot.squad_id
  };
  if (validPotType(pot.pot_type)) {
    sanitizedPot.pot_type = pot.pot_type
  }
  // sanitizeCurrency removes trailing zeros
  if (validPotMoney(pot.fee)) {
    sanitizedPot.fee = sanitizeCurrency(pot.fee);
  }
  if (validSortOrder(pot.sort_order)) {
    sanitizedPot.sort_order = pot.sort_order
  }
  return sanitizedPot
} 

/**
 * validates a pot object
 *
 * @param pot - pot to validate
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 */
export function validatePot(pot: potType): ErrorCode {
  try {
    const errCode = gotPotData(pot);
    if (errCode !== ErrorCode.None) {
      return errCode;
    }
    return validPotData(pot);
  } catch (pot) {
    return ErrorCode.OtherError;
  }
}

export const exportedForTesting = {
  gotPotData,
  validPotData,
};
