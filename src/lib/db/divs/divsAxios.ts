import axios from "axios";
import { baseDivsApi } from "@/lib/db/apiPaths";
import { testBaseDivsApi } from "../../../../test/testApi";
import { divType } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

const url = testBaseDivsApi.startsWith("undefined")
  ? baseDivsApi
  : testBaseDivsApi;   
const oneDivUrl = url + "/div/";
const oneTmntUrl = url + "/tmnt/";  

/**
 * posts a div
 * 
 * @param {divType} div - div to post
 * @returns - div posted or null
 */  
export const postDiv = async (div: divType): Promise<divType | null> => {
  
  // further sanatation and validation done in POST route

  try {
    const divJSON = JSON.stringify(div);
    const response = await axios({
      method: "post",
      data: divJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.div
      : null
  } catch (err) {
    return null;
  }
}

/**
 * puts a div
 * 
 * @param {divType} event - div to put
 * @returns - div putted or null
 */  
export const putDiv = async (div: divType): Promise<divType | null> => {
  
  // further sanatation and validation done in PUT route

  try {
    const divJSON = JSON.stringify(div);
    const response = await axios({
      method: "put",
      data: divJSON,
      withCredentials: true,
      url: oneDivUrl + div.id,
    });
    return (response.status === 200)
      ? response.data.div
      : null
  } catch (err) {
    return null;
  }
}

/**
 * deletes a div
 * 
 * @param {string} id - id of div to delete
 * @returns - 1 if deleted, -1 if not found or error
 */  
export const deleteDiv = async (id: string): Promise<number> => {
  try {
    if (!id || !isValidBtDbId(id, "div")) return -1
    const response = await axios({
      method: "delete",
      withCredentials: true,
      url: oneDivUrl + id,
    });
    return (response.status === 200) ? 1 : -1
  } catch (err) {
    return -1;
  }
}

/**
 * deletes all divs for a tmnt
 * 
 * @param {string} tmntId - id of tmnt with divs to delete
 * @returns - # of rows deleted, -1 if tmntId is invalid or an error
 */
export const deleteAllTmntDivs = async (tmntId: string): Promise<number> => {
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