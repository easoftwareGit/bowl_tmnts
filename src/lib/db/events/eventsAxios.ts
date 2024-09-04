import axios from "axios";
import { baseEventsApi } from "@/lib/db/apiPaths";
import { testBaseEventsApi } from "../../../../test/testApi";
import { eventType } from "@/lib/types/types";

const url = testBaseEventsApi.startsWith("undefined")
  ? baseEventsApi
  : testBaseEventsApi;   

export const postEvent = async (event: eventType): Promise<eventType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    const eventJSON = JSON.stringify(event);
    const response = await axios({
      method: "post",
      data: eventJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.event
      : null
  } catch (err) {
    return null;
  }
}
