import axios from "axios";
import { baseLanesApi } from "@/lib/db/apiPaths";
import { testBaseLanesApi } from "../../../../test/testApi";
import { laneType } from "@/lib/types/types";

const url = testBaseLanesApi.startsWith("undefined")
  ? baseLanesApi
  : testBaseLanesApi;   

export const postLane = async (lane: laneType): Promise<laneType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    const laneJSON = JSON.stringify(lane);
    const response = await axios({
      method: "post",
      data: laneJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.lane
      : null
  } catch (err) {
    return null;
  }
}