import {
  maxEventLength,
  minSortOrder,
  maxSortOrder,
  ErrorCode,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";

export type featToCheck = {  
  feat_name: string;
  entry_type: string;  
  sort_order: number;
};

export function gotFeatData(feat: featToCheck): ErrorCode {
  try {
    if (
      !sanitize(feat.feat_name)      
      || !feat.entry_type      
      || (typeof feat.sort_order !== 'number')      
    ) {
      return ErrorCode.MissingData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validFeatData(feat: featToCheck): ErrorCode {
  try {    
    if (
      feat.feat_name &&
      sanitize(feat.feat_name).length > maxEventLength
    ) {
      return ErrorCode.InvalidData;
    }
    if (feat.entry_type && !(feat.entry_type === 'single' || feat.entry_type === 'multiple')) {
      return ErrorCode.InvalidData;
    }
    if (typeof feat.sort_order === 'number' && (feat.sort_order < minSortOrder || feat.sort_order > maxSortOrder)) {
      return ErrorCode.InvalidData;
    }
    return ErrorCode.None;
  } catch (error) {
    return ErrorCode.OtherError;
  }
}

export function validateFeat(feat: featToCheck): ErrorCode { 
  try {
    const errCode = gotFeatData(feat)
    if (errCode !== ErrorCode.None) {
      return errCode
    }    
    return validFeatData(feat)
  } catch (error) {
    return ErrorCode.OtherError
  }
}
