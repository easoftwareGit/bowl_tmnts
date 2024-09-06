import axios from "axios";
import { baseBrktsApi } from "@/lib/db/apiPaths";
import { testBaseBrktsApi } from "../../../../test/testApi";
import { brktType } from "@/lib/types/types";

const url = testBaseBrktsApi.startsWith("undefined")
  ? baseBrktsApi
  : testBaseBrktsApi;   

/**
 * get array of brackets
 *
 * @returns { data: brktType[] } - array of brackets;
 */

export const postBrkt = async (brkt: brktType): Promise<brktType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    const brktJSON = JSON.stringify(brkt);
    const response = await axios({
      method: "post",
      data: brktJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.brkt
      : null
  } catch (err) {
    return null;
  }
}