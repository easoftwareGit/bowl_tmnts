import axios from "axios";
import { baseSquadsApi } from "@/lib/db/apiPaths";
import { testBaseSquadsApi } from "../../../../test/testApi";
import { squadType } from "@/lib/types/types";

const url = testBaseSquadsApi.startsWith("undefined")
  ? baseSquadsApi
  : testBaseSquadsApi;  
  
export const postSquad = async (squad: squadType): Promise<squadType | null> => {

  // all sanatation and validation done in POST route

  try {
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
