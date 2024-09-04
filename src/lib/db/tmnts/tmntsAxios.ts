import axios from "axios";
import { baseTmntsApi } from "@/lib/db/apiPaths";
import { testBaseTmntsApi } from "../../../../test/testApi";
import { tmntType } from "@/lib/types/types";

const url = testBaseTmntsApi.startsWith("undefined")
  ? baseTmntsApi
  : testBaseTmntsApi;   

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