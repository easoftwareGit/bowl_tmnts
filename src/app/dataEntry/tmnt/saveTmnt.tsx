import { postTmnt, putTmnt } from "@/lib/db/tmnts/tmntsAxios";
import { saveTypes, tmntType } from "@/lib/types/types";

/**
 * saves a tournament
 * 
 * @param {tmntType} origTmnt - original tmnt
 * @param {tmntType} tmnt - tmnt to save
 * @param {saveTypes} saveType - save type, 'CREATE' or 'UPDATE'
 * @returns {tmntType | null} - tmnt saved or null
 */
export const tmntSaveTmnt = async (origTmnt: tmntType, tmnt: tmntType, saveType: saveTypes): Promise<tmntType | null> => { 
 
  // data error sanitize/vailadtion done in postTmnt or putTmnt
  if (!tmnt || !saveType) return null;
  if (saveType === 'CREATE') {    
    return await postTmnt(tmnt)
  } else if (saveType === 'UPDATE') {
    // if tmnt not edited, return original tmnt
    if (JSON.stringify(origTmnt) === JSON.stringify(tmnt)) return tmnt;
    // if tmnt edited, put it
    return await putTmnt(tmnt)  
  } else {
    return null
  }
}
