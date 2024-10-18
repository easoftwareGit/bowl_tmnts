import { deleteElim, postElim, postManyElims, putElim } from "@/lib/db/elims/elimsAxios";
import { elimType, saveTypes } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt elims based on elim status
 * 
 * @param {elimType[]} origElims - original elims in tmnts
 * @param {elimType[]} elims - current elims to save
 * @returns {elimType[] | null} - array of saved current elims or null
 */
const tmntPostPutOrDelElims = async (origElims: elimType[], elims: elimType[]): Promise<elimType[] | null> => { 

  const savedElims: elimType[] = [];
  // if user has deleted a elim, the elim will be in origElims
  // and not in elims. Delete the elim from the db.
  for (let i = 0; i < origElims.length; i++) {
    const elim = origElims[i];
    if (isValidBtDbId(elim.id, 'elm')) {
      const foundElim = elims.find((e) => e.id === elim.id);
      if (!foundElim) {
        const delElimCount = await deleteElim(elim.id);
        if (delElimCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added an elim, the elim will be in elims
  for (let i = 0; i < elims.length; i++) {
    // if not a new elim
    if (isValidBtDbId(elims[i].id, 'elm')) {
      // find origonal elim
      const foundOrig = origElims.find((e) => e.id === elims[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(elims[i])) {
          const puttedElim = await putElim(elims[i]);
          if (!puttedElim) {
            return null
          }
          savedElims.push(puttedElim);
        } else {
          savedElims.push(foundOrig);
        }
      } else { // else a new elim
        const postedElim = await postElim(elims[i]);
        if (!postedElim) {
          return null
        }
        savedElims.push(postedElim);
      }
    }
  }
  return savedElims;
}

/**
 * saves tmnt elims
 * 
 * @param {elimType[]} origElims - original elims in tmnts
 * @param {elimType[]} elims - current elims to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {elimType[] | null} - array of saved current elims or null
 */
export const tmntSaveElims = async (origElims: elimType[], elims: elimType[], saveType: saveTypes): Promise<elimType[] | null> => { 

  if (!origElims || !elims || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyElims(elims)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelElims(origElims, elims)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelElims,    
};
