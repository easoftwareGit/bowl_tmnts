import axios, { AxiosError } from "axios";
import { baseSquadsApi } from "@/lib/db/apiPaths";
import { testBaseSquadsApi } from "../../../testApi";
import { squadType } from "@/lib/types/types";
import { initSquad } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postSquad } from "@/lib/db/squads/squadsAxios";
import { compareAsc } from "date-fns";

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

const url = testBaseSquadsApi.startsWith("undefined")
  ? baseSquadsApi
  : testBaseSquadsApi;   

describe('postSquad', () => { 

  const squadToPost = {
    ...initSquad,
    id: '',
    squad_name: 'Test Squad',
    event_id: "evt_bd63777a6aee43be8372e4d008c1d6d0",    
    squad_date: new Date(Date.UTC(2022, 7, 21)),  // month is -1 
    squad_time: '02:00 PM',
    games: 6,
    lane_count: 24, 
    starting_lane: 1,
    sort_order: 1,
  }

  let createdSquadId = '';

  beforeAll(async () => { 
    const response = await axios.get(url);
    const squads = response.data.squads;
    const toDel = squads.find((s: squadType) => s.squad_name === 'Test Squad');
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
    createdSquadId = "";
  })

  afterEach(async () => {
    if (createdSquadId) {
      const delResponse = await axios({
        method: "delete",
        withCredentials: true,
        url: url + "/" + createdSquadId,
      });
    }
    createdSquadId = "";
  })

  it('should post a squad', async () => { 
    const postedSquad = await postSquad(squadToPost);
    expect(postedSquad).not.toBeNull();
    if(!postedSquad) return;
    createdSquadId = postedSquad.id;
    expect(postedSquad.squad_name).toBe(squadToPost.squad_name);
    expect(postedSquad.event_id).toBe(squadToPost.event_id);
    expect(compareAsc(postedSquad.squad_date, squadToPost.squad_date)).toBe(0);
    expect(postedSquad.squad_time).toBe(squadToPost.squad_time);
    expect(postedSquad.games).toBe(squadToPost.games);
    expect(postedSquad.lane_count).toBe(squadToPost.lane_count);
    expect(postedSquad.starting_lane).toBe(squadToPost.starting_lane);
    expect(postedSquad.sort_order).toBe(squadToPost.sort_order);
    expect(isValidBtDbId(postedSquad.id, 'sqd')).toBeTruthy();
  })
  it('should NOT post a squad with invalid data', async () => { 
    const invalidSquad = {
      ...squadToPost,
      squad_name: '',      
    }
    const postedSquad = await postSquad(invalidSquad);
    expect(postedSquad).toBeNull();
  })
})  