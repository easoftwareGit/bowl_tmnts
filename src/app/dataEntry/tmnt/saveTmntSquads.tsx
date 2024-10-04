import { deleteSquad, postSquad, putSquad } from "@/lib/db/squads/squadsAxios";
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
  // if user has deleted an squad, the squad will be in origSquads
  // and not in squads. Delete the div from the db.
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

  // if user has added an squad, the div will be in squads
  for (let i = 0; i < squads.length; i++) {
    // if not a new div
    if (isValidBtDbId(squads[i].id, 'sqd')) {
      // find origonal div
      const foundOrig = origSquads.find((s) => s.id === squads[i].id);
      if (foundOrig) {
        if (JSON.stringify(foundOrig) !== JSON.stringify(squads[i])) {
          const puttedSquad = await putSquad(squads[i]);
          if (!puttedSquad) return null
          savedSquads.push(puttedSquad);
        } else {
          savedSquads.push(foundOrig);
        }
      } else { // else a new div
        const postedDiv = await postSquad(squads[i]);
        if (!postedDiv) return null
        savedSquads.push(postedDiv);
      }
    }
  }
  return savedSquads;
}

/**
 * posts tmnt squads
 * 
 * @param {saveTypes[]} squads - squads to save
 * @returns {squadType[] | null} - array of saved current squads or null
 */
const tmntPostDivs = async (squads: squadType[]): Promise<squadType[] | null> => {

  const postedSquads: squadType[] = [];
  for await (const squad of squads) {
    const postedSquad = await postSquad(squad);
    if (!postedSquad) return null
    postedSquads.push(postedSquad);
  }
  return postedSquads;
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
    return await tmntPostDivs(squads) 
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelSquads(origSquads, squads)
  } else {  
    return null
  }
}