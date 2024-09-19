import axios from "axios";
import { baseTmntsApi } from "@/lib/db/apiPaths";
import { testBaseTmntsApi } from "../../../../test/testApi";
import { tmntType } from "@/lib/types/types";

const url = testBaseTmntsApi.startsWith("undefined")
  ? baseTmntsApi
  : testBaseTmntsApi;   

/**
 * posts a tmnt
 * 
 * @param {tmntType} tmnt - tmnt to post
 * @returns - tmnt posted or null
 */  
export const postTmnt = async (tmnt: tmntType): Promise<tmntType | null> => {
  
  // all sanatation and validation done in POST route

  try {
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
    const tmntJSON = JSON.stringify(tmnt);
    const response = await axios({
      method: "put",
      data: tmntJSON,
      withCredentials: true,
      url: url + "/" + tmnt.id,
    });
    return (response.status === 200)
      ? response.data.tmnt
      : null
  } catch (err) {
    return null;
  }
}