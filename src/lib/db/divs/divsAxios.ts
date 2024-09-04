import axios from "axios";
import { baseDivsApi } from "@/lib/db/apiPaths";
import { testBaseDivsApi } from "../../../../test/testApi";
import { divType } from "@/lib/types/types";

const url = testBaseDivsApi.startsWith("undefined")
  ? baseDivsApi
  : testBaseDivsApi;   

export const postDiv = async (div: divType): Promise<divType | null> => {
  
  // all sanatation and validation done in POST route

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