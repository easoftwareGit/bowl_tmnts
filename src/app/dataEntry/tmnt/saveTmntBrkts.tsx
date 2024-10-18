import { deleteBrkt, postBrkt, postManyBrkts, putBrkt } from "@/lib/db/brkts/brktsAxios";
import { brktType, saveTypes } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt brkts based on brkt status
 * 
 * @param {brktType[]} origBrkts - original brkts in tmnts
 * @param {brktType[]} brkts - current brkts to save
 * @returns {brktType[] | null} - array of saved current brkts or null
 */
const tmntPostPutOrDelBrkts = async (origBrkts: brktType[], brkts: brktType[]): Promise<brktType[] | null> => { 

  const savedBrkts: brktType[] = [];
  // if user has deleted a brkt, the brkt will be in origBrkts
  // and not in brkts. Delete the brkt from the db.
  for (let i = 0; i < origBrkts.length; i++) {
    const brkt = origBrkts[i];
    if (isValidBtDbId(brkt.id, 'brk')) {
      const foundBrkt = brkts.find((b) => b.id === brkt.id);
      if (!foundBrkt) {
        const delBrktCount = await deleteBrkt(brkt.id);
        if (delBrktCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added a brkt, the brkt will be in brkts
  for (let i = 0; i < brkts.length; i++) {
    // if not a new brkt
    if (isValidBtDbId(brkts[i].id, 'brk')) {
      // find origonal brkt
      const foundOrig = origBrkts.find((b) => b.id === brkts[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(brkts[i])) {
          const puttedBrkt = await putBrkt(brkts[i]);
          if (!puttedBrkt) {
            return null
          }
          savedBrkts.push(puttedBrkt);
        } else {
          savedBrkts.push(foundOrig);
        }
      } else { // else a new brkt
        const postedBrkt = await postBrkt(brkts[i]);
        if (!postedBrkt) {
          return null
        }
        savedBrkts.push(postedBrkt);
      }
    }
  }
  return savedBrkts;
}

/**
 * saves tmnt brkts
 * 
 * @param {brktType[]} origBrkts - original brkts in tmnts
 * @param {brktType[]} brkts - current brkts to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {brktType[] | null} - array of saved current brkts or null
 */
export const tmntSaveBrkts = async (origBrkts: brktType[], brkts: brktType[], saveType: saveTypes): Promise<brktType[] | null> => { 

  if (!origBrkts || !brkts || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyBrkts(brkts)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelBrkts(origBrkts, brkts)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelBrkts,    
};
