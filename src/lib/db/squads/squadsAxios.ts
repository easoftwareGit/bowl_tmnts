import axios from "axios";
import { baseSquadsApi } from "@/lib/db/apiPaths";
import { testBaseSquadsApi } from "../../../../test/testApi";
import { squadType } from "@/lib/types/types";
import { validateSquad } from "@/app/api/squads/validate";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";

const url = testBaseSquadsApi.startsWith("undefined")
  ? baseSquadsApi
  : testBaseSquadsApi;  
const oneSquadUrl = url + "/squad/"; 
const oneEventUrl = url + "/event/";
const oneTmntUrl = url + "/tmnt/";
    
/**
 * post a new squad
 * 
 * @param {squadType} squad - squad to post
 * @returns - posted squad or null 
 */  
export const postSquad = async (squad: squadType): Promise<squadType | null> => {

  try {
    // further sanatation and validation done in POST route
    if (validateSquad(squad) !== ErrorCode.None) return null
    const squadJSON = JSON.stringify(squad);
    const response = await axios({
      method: "post",
      data: squadJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.squad
      : null
  } catch (err) {
    return null;
  }
}

/**
 * puts a squad
 * 
 * @param {squadType} squad - squad to put
 * @returns - putted squad or null
 */
export const putSquad = async (squad: squadType): Promise<squadType | null> => { 

  try {
    // further sanatation and validation done in PUT route
    if (validateSquad(squad) !== ErrorCode.None) return null
    const squadJSON = JSON.stringify(squad);
    const response = await axios({
      method: "put",
      data: squadJSON,
      withCredentials: true,
      url: oneSquadUrl + squad.id,
    });
    return (response.status === 200)
      ? response.data.squad
      : null
  } catch (err) {
    return null;
  }
}

/**
 * deletes a squad
 * 
 * @param id - id of squad to delete
 * @returns - 1 if deleted, -1 if not found or error
 */
export const deleteSquad = async (id: string): Promise<number> => {

  try {
    if (!id || !isValidBtDbId(id, "sqd")) return -1
    const response = await axios({
      method: "delete",
      withCredentials: true,
      url: oneSquadUrl + id,
    });
    return (response.status === 200) ? 1 : -1
  } catch (err) {
    return -1;
  }
}

/**
 * deletes all event squads
 * 
 * @param {string} eventId - id of event to delete all event squads 
 * @returns {number} - # of squads deleted, -1 if tmntId is invalid or an error
 */
export const deleteAllEventSquads = async (eventId: string): Promise<number> => {
  try {
    if (!eventId || !isValidBtDbId(eventId, "evt")) return -1
    const response = await axios({
      method: "delete",
      withCredentials: true,
      url: oneEventUrl + eventId,
    });
    return (response.status === 200) ? response.data.deleted.count : -1
  } catch (err) {
    return -1;
  }
}

/**
 * deletes all tmnt squads
 * 
 * @param tmntId - id of tmnt with squads to delete
 * @returns {number} - # of squads deleted, -1 if tmntId is invalid or an error
 */
export const deleteAllTmntSquads = async (tmntId: string): Promise<number> => {
  try {
    if (!tmntId || !isValidBtDbId(tmntId, "tmt")) return -1
    const response = await axios({
      method: "delete",
      withCredentials: true,
      url: oneTmntUrl + tmntId,
    });
    return (response.status === 200) ? response.data.deleted.count : -1
  } catch (err) {
    return -1;
  }
}