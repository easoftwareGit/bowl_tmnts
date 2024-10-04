import axios from "axios";
import { baseTmntsApi } from "@/lib/db/apiPaths";
import { testBaseTmntsApi } from "../../../../test/testApi";
import { tmntType } from "@/lib/types/types";
import { validateTmnt } from "@/app/api/tmnts/valildate";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";

const url = testBaseTmntsApi.startsWith("undefined")
  ? baseTmntsApi
  : testBaseTmntsApi;   
const oneTmntUrl = url + "/tmnt/"; 

/**
 * posts a tmnt
 * 
 * @param {tmntType} tmnt - tmnt to post
 * @returns - tmnt posted or null
 */  
export const postTmnt = async (tmnt: tmntType): Promise<tmntType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    if (validateTmnt(tmnt) !== ErrorCode.None) return null
    const tmntJSON = JSON.stringify(tmnt);
    const response = await axios({
      method: "post",
      data: tmntJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.tmnt
      : null
  } catch (err) {
    return null;
  }
}

/**
 * puts a tmnt
 * 
 * @param {tmntType} tmnt - tmnt to put 
 * @returns putted tmnt or null
 */
export const putTmnt = async (tmnt: tmntType): Promise<tmntType | null> => { 

  // all sanatation and validation done in PUT route
  
  try {
    if (validateTmnt(tmnt) !== ErrorCode.None) return null
    const tmntJSON = JSON.stringify(tmnt);
    const response = await axios({
      method: "put",
      data: tmntJSON,
      withCredentials: true,
      url: oneTmntUrl + tmnt.id,
    });
    return (response.status === 200)
      ? response.data.tmnt
      : null
  } catch (err) {
    return null;
  }
}

/**
 * deletes a tmnt
 * 
 * @param {string} id - id of tmnt to delete
 * @returns - true if deleted, false if not
 */
export const deleteTmnt = async (id: string): Promise<boolean> => {

  try {
    if (!id || !isValidBtDbId(id, 'tmt')) return false
    const response = await axios({
      method: "delete",
      withCredentials: true,
      url: oneTmntUrl + id,
    });
    return (response.status === 200);
  } catch (err) {
    return false;
  }
}