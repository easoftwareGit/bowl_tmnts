import { deleteSquad, postManySquads, postSquad, putSquad } from "@/lib/db/squads/squadsAxios";
import { saveTypes, squadType } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt squads based on squad status
 * 
 * @param {squadType[]} origSquads - original squads in tmnts
 * @param {squadType[]} squads - current squads to save
 * @returns {squadType[] | null} - array of saved current squads or null 
 * */
const tmntPostPutOrDelSquads = async (origSquads: squadType[], squads: squadType[]): Promise<squadType[] | null> => { 

  const savedSquads: squadType[] = [];
  // if user has deleted a squad, the squad will be in origSquads
  // and not in squads. Delete the squad from the db.
  for (let i = 0; i < origSquads.length; i++) {
    const squad = origSquads[i];
    if (isValidBtDbId(squad.id, 'sqd')) {
      const foundDiv = squads.find((s) => s.id === squad.id);
      if (!foundDiv) {
        const delSquadCount = await deleteSquad(squad.id);
        if (delSquadCount !== 1) return null
      }
    }
  }

  // if user has added a squad, the lane will be in squads
  for (let i = 0; i < squads.length; i++) {
    // if not a new squad
    if (isValidBtDbId(squads[i].id, 'sqd')) {
      // find origonal squad
      const foundOrig = origSquads.find((s) => s.id === squads[i].id);
      if (foundOrig) {
        if (JSON.stringify(foundOrig) !== JSON.stringify(squads[i])) {
          const puttedSquad = await putSquad(squads[i]);
          if (!puttedSquad) return null
          savedSquads.push(puttedSquad);
        } else {
          savedSquads.push(foundOrig);
        }
      } else { // else a new lane
        const postedSquad = await postSquad(squads[i]);
        if (!postedSquad) return null
        savedSquads.push(postedSquad);
      }
    }
  }
  return savedSquads;
}

/**
 * saves tmnt squads
 * 
 * @param {squadType[]} origSquads - original squads in tmnts
 * @param {squadType[]} squads - current squads to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {squadType[] | null} - array of saved current squads or null
 */
export const tmntSaveSquads = async (origSquads: squadType[], squads: squadType[], saveType: saveTypes): Promise<squadType[] | null> => { 

  if (!origSquads || !squads || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManySquads(squads)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelSquads(origSquads, squads)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelSquads,    
};
