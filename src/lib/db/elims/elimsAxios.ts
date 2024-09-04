import axios from "axios";
import { baseElimsApi } from "@/lib/db/apiPaths";
import { testBaseElimsApi } from "../../../../test/testApi";
import { elimType } from "@/lib/types/types";

const url = testBaseElimsApi.startsWith("undefined")
  ? baseElimsApi
  : testBaseElimsApi;   

export const postElim = async (elim: elimType): Promise<elimType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    const elimJSON = JSON.stringify(elim);
    const response = await axios({
      method: "post",
      data: elimJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.elim
      : null
  } catch (err) {
    return null;
  }
}