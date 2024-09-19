import axios, { AxiosError } from "axios";
import { baseSquadsApi } from "@/lib/db/apiPaths";
import { testBaseSquadsApi } from "../../../testApi";
import { squadType } from "@/lib/types/types";
import { initSquad } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postSquad } from "@/lib/db/squads/squadsAxios";
import { compareAsc } from "date-fns";
import { startOfDayFromString } from "@/lib/dateTools";

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
const oneSquadUrl = url + "/squad/"

describe('postSquad', () => { 

  const squadToPost = {
    ...initSquad,    
    squad_name: 'Test Squad',
    event_id: "evt_c0b2bb31d647414a9bea003bd835f3a0",    
    squad_date: startOfDayFromString('2022-08-21') as Date, 
    squad_time: '02:00 PM',
    games: 6,
    lane_count: 24, 
    starting_lane: 1,
    sort_order: 1,
  }

  let createdSquad = false;

  const deletePostedSquad = async () => {
    const response = await axios.get(url);
    const squads = response.data.squads;
    const toDel = squads.find((s: squadType) => s.squad_name === 'Test Squad');
    if (toDel) {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: oneSquadUrl + toDel.id
        });        
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    }
  } 

  beforeAll(async () => { 
    await deletePostedSquad();
  })

  beforeEach(() => {
    createdSquad = false;
  })

  afterEach(async () => {
    if (createdSquad) {
      await deletePostedSquad();
    }
  })

  it('should post a squad', async () => { 
    const postedSquad = await postSquad(squadToPost);
    expect(postedSquad).not.toBeNull();
    if(!postedSquad) return;
    createdSquad = true;
    expect(postedSquad.squad_name).toBe(squadToPost.squad_name);
    expect(postedSquad.event_id).toBe(squadToPost.event_id);
    const squadDate = new Date(postedSquad.squad_date);
    expect(compareAsc(squadDate, squadToPost.squad_date)).toBe(0);
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