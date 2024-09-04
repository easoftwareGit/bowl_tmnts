import axios from "axios";
import { basePotsApi } from "@/lib/db/apiPaths";
import { testBasePotsApi } from "../../../../test/testApi";
import { potType } from "@/lib/types/types";

const url = testBasePotsApi.startsWith("undefined")
  ? basePotsApi
  : testBasePotsApi;   

export const postPot = async (pot: potType): Promise<potType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    const potJSON = JSON.stringify(pot);
    const response = await axios({
      method: "post",
      data: potJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.pot
      : null
  } catch (err) {
    return null;
  }
}