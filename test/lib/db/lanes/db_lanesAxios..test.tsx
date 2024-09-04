import axios, { AxiosError } from "axios";
import { baseLanesApi } from "@/lib/db/apiPaths";
import { testBaseLanesApi } from "../../../testApi";
import { laneType } from "@/lib/types/types";
import { initLane } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postLane } from "@/lib/db/lanes/lanesAxios";

// before running this test, run the following commands in the terminal:
// 1) clear and re-seed the database
//    a) clear the database
//       npx prisma db push --force-reset
//    b) re-seed
//       npx prisma db seed  
//    if just need to re-seed, then only need step 1b
// 2) make sure the server is running
//    in the VS activity bar, 
//      a) click on "Run and Debug" (Ctrl+Shift+D)
//      b) at the top of the window, click on the drop-down arrow
//      c) select "Node.js: debug server-side"
//      d) directly to the left of the drop down select, click the green play button
//         This will start the server in debug mode. 

const url = testBaseLanesApi.startsWith("undefined")
  ? baseLanesApi
  : testBaseLanesApi;   

describe('postLane', () => { 

  const laneToPost = {
    ...initLane,
    id: '',
    squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
    lane_number: 1
  }

  let createdLaneId = '';

  beforeAll(async () => { 
    const response = await axios.get(url);
    const lanes = response.data.lanes;
    const toDel = lanes.find((l: laneType) => l.squad_id === 'sqd_3397da1adc014cf58c44e07c19914f72');
    if (toDel) {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDel.id
        });
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    }
  })

  beforeEach(() => {
    createdLaneId = "";
  })

  afterEach(async () => {
    if (createdLaneId) {
      const delResponse = await axios({
        method: "delete",
        withCredentials: true,
        url: url + "/" + createdLaneId,
      });
    }
    createdLaneId = "";
  })

  it('should post a lane', async () => {
    const postedLane = await postLane(laneToPost);
    expect(postedLane).not.toBeNull();
    if (!postedLane) return;
    createdLaneId = postedLane.id;
    expect(postedLane.squad_id).toBe(laneToPost.squad_id);
    expect(postedLane.lane_number).toBe(laneToPost.lane_number);
    expect(isValidBtDbId(postedLane.id, 'lan')).toBeTruthy();
  })
  it('should NOT post a lane with invalid data', async () => { 
    const invalidLane = {
      ...laneToPost,
      lane_number: 0
    }
    const postedLane = await postLane(invalidLane);
    expect(postedLane).toBeNull();
  })

})