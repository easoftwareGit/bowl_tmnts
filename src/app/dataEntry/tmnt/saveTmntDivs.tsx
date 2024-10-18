import { deleteDiv, postDiv, postManyDivs, putDiv } from "@/lib/db/divs/divsAxios";
import { divType, saveTypes } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt divs based on div status
 * 
 * @param {divType[]} origDivs - original divs in tmnts
 * @param {divType[]} divs - current divs to save
 * @returns {divType[] | null} - array of saved current divs or null
 */
const tmntPostPutOrDelDivs = async (origDivs: divType[], divs: divType[]): Promise<divType[] | null> => {

  const savedDivs: divType[] = [];
  // if user has deleted an div, the div will be in origDivs
  // and not in divs. Delete the div from the db.
  for (let i = 0; i < origDivs.length; i++) {
    const div = origDivs[i];
    if (isValidBtDbId(div.id, 'div')) {
      const foundDiv = divs.find((d) => d.id === div.id);
      if (!foundDiv) {
        const delDivCount = await deleteDiv(div.id);
        if (delDivCount !== 1) return null
      }
    }
  }

  // if user has added an div, the div will be in divs
  for (let i = 0; i < divs.length; i++) {
    // if not a new div
    if (isValidBtDbId(divs[i].id, 'div')) {
      // find origonal div
      const foundOrig = origDivs.find((d) => d.id === divs[i].id);
      if (foundOrig) {
        if (JSON.stringify(foundOrig) !== JSON.stringify(divs[i])) {
          const puttedDiv = await putDiv(divs[i]);
          if (!puttedDiv) return null
          savedDivs.push(puttedDiv);
        } else {
          savedDivs.push(foundOrig);
        }
      } else { // else a new div
        const postedDiv = await postDiv(divs[i]);
        if (!postedDiv) return null
        savedDivs.push(postedDiv);
      }
    }
  }
  return savedDivs;
}

/**
 * saves tmnt divs
 * 
 * @param {divType[]} origDivs - original divs in tmnts
 * @param {divType[]} divs - current divs to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {divType[] | null} - array of saved current divs or null
 */
export const tmntSaveDivs = async (origDivs: divType[], divs: divType[], saveType: saveTypes): Promise<divType[] | null> => {

  if (!origDivs || !divs || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyDivs(divs); 
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelDivs(origDivs, divs)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelDivs,  
};
