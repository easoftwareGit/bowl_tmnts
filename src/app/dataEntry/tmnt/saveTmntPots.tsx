import { deletePot, postPot, postManyPots, putPot } from "@/lib/db/pots/potsAxios";
import { potType, saveTypes } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt pots based on pot status
 * 
 * @param {potType[]} origPots - original pots in tmnts
 * @param {potType[]} pots - current pots to save
 * @returns {potType[] | null} - array of saved current pots or null
 */
const tmntPostPutOrDelPots = async (origPots: potType[], pots: potType[]): Promise<potType[] | null> => { 

  const savedPots: potType[] = [];
  // if user has deleted a pot, the pot will be in origPots
  // and not in pots. Delete the pot from the db.
  for (let i = 0; i < origPots.length; i++) {
    const pot = origPots[i];
    if (isValidBtDbId(pot.id, 'pot')) {
      const foundPot = pots.find((p) => p.id === pot.id);
      if (!foundPot) {
        const delPotCount = await deletePot(pot.id);
        if (delPotCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added a pot, the pot will be in pots
  for (let i = 0; i < pots.length; i++) {
    // if not a new pot
    if (isValidBtDbId(pots[i].id, 'pot')) {
      // find origonal pot
      const foundOrig = origPots.find((p) => p.id === pots[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(pots[i])) {
          const puttedPot = await putPot(pots[i]);
          if (!puttedPot) {
            return null
          }
          savedPots.push(puttedPot);
        } else {
          savedPots.push(foundOrig);
        }
      } else { // else a new pot
        const postedPot = await postPot(pots[i]);
        if (!postedPot) {
          return null
        }
        savedPots.push(postedPot);
      }
    }
  }
  return savedPots;
}

/**
 * saves tmnt pots
 * 
 * @param {potType[]} origPots - original pots in tmnts
 * @param {potType[]} pots - current pots to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {potType[] | null} - array of saved current pots or null
 */
export const tmntSavePots = async (origPots: potType[], pots: potType[], saveType: saveTypes): Promise<potType[] | null> => { 

  if (!origPots || !pots || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyPots(pots)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelPots(origPots, pots)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelPots,    
};
