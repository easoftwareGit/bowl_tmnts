import { deleteLane, postLane, postManyLanes, putLane } from "@/lib/db/lanes/lanesAxios";
import { laneType, saveTypes } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt lanes based on lane status
 * 
 * @param {laneType[]} origLanes - original lanes in tmnts
 * @param {laneType[]} lanes - current lanes to save
 * @returns {laneType[] | null} - array of saved current lanes or null 
 * */
const tmntPostPutOrDelLanes = async (origLanes: laneType[], lanes: laneType[]): Promise<laneType[] | null> => { 

  const savedLanes: laneType[] = [];
  // if user has deleted a lane, the lane will be in origLanes
  // and not in lanes. Delete the lane from the db.
  for (let i = 0; i < origLanes.length; i++) {
    const lane = origLanes[i];
    if (isValidBtDbId(lane.id, 'lan')) {
      const foundLane = lanes.find((l) => l.id === lane.id);
      if (!foundLane) {
        const delLaneCount = await deleteLane(lane.id);
        if (delLaneCount !== 1) {
          return null
        }
      }
    }
  }

  // if user has added a lane, the lane will be in lanes
  for (let i = 0; i < lanes.length; i++) {
    // if not a new lane
    if (isValidBtDbId(lanes[i].id, 'lan')) {
      // find origonal lane
      const foundOrig = origLanes.find((l) => l.id === lanes[i].id);
      if (foundOrig) {        
        if (JSON.stringify(foundOrig) !== JSON.stringify(lanes[i])) {
          const puttedLane = await putLane(lanes[i]);
          if (!puttedLane) {
            return null
          }
          savedLanes.push(puttedLane);
        } else {
          savedLanes.push(foundOrig);
        }
      } else { // else a new lane
        const postedLane = await postLane(lanes[i]);
        if (!postedLane) {
          return null
        }
        savedLanes.push(postedLane);
      }
    }
  }
  return savedLanes;
}

/**
 * saves tmnt lanes
 * 
 * @param {laneType[]} origLanes - original lanes in tmnts
 * @param {laneType[]} lanes - current lanes to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns {laneType[] | null} - array of saved current lanes or null
 */
export const tmntSaveLanes = async (origLanes: laneType[], lanes: laneType[], saveType: saveTypes): Promise<laneType[] | null> => { 

  if (!origLanes || !lanes || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyLanes(lanes)
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelLanes(origLanes, lanes)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelLanes,    
};
