import axios, { AxiosError } from "axios";
import { baseBrktsApi } from "@/lib/db/apiPaths";
import { testBaseBrktsApi } from "../../../testApi";
import { brktType } from "@/lib/types/types";
import { initBrkt } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postBrkt } from "@/lib/db/brkts/brktsAxios";

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

const url = testBaseBrktsApi.startsWith("undefined")
  ? baseBrktsApi
  : testBaseBrktsApi;    
const oneBrktUrl = url + "/brkt/";    

describe('postDiv', () => { 

  const brktToPost = {
    ...initBrkt,    
    squad_id: "sqd_3397da1adc014cf58c44e07c19914f72",
    div_id: "div_66d39a83d7a84a8c85d28d8d1b2c7a90",
    sort_order: 1,    
    start: 1,
    games: 3,
    players: 8,
    fee: '4',
    first: '20',
    second: '8',
    admin: '4',
    fsa: '32',
  }

  let createdBrkt = false;

  const deletePostedBrbkt = async () => { 
    const response = await axios.get(url);
    const brkts = response.data.brkts;
    const toDel = brkts.find((b: brktType) => b.fee === '3');
    if (toDel) {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: oneBrktUrl + toDel.id          
        });        
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    }
  }

  beforeAll(async () => { 
    await deletePostedBrbkt();
  })

  beforeEach(() => {
    createdBrkt = false;
  })

  afterEach(async () => {
    if (createdBrkt) {
      await deletePostedBrbkt();
    }
  })

  it('should post a brkt', async () => { 
    const postedBrkt = await postBrkt(brktToPost);
    expect(postedBrkt).not.toBeNull();
    if(!postedBrkt) return;
    createdBrkt = true;
    expect(postedBrkt.id).toBe(brktToPost.id);
    expect(postedBrkt.squad_id).toBe(brktToPost.squad_id);
    expect(postedBrkt.div_id).toBe(brktToPost.div_id);    
    expect(postedBrkt.start).toBe(brktToPost.start);
    expect(postedBrkt.games).toBe(brktToPost.games);
    expect(postedBrkt.fee).toBe(brktToPost.fee);
    expect(postedBrkt.first).toBe(brktToPost.first);
    expect(postedBrkt.second).toBe(brktToPost.second);
    expect(postedBrkt.admin).toBe(brktToPost.admin);    
    expect(postedBrkt.sort_order).toBe(brktToPost.sort_order);    
  })
  it('should NOT post a brkt with invalid data', async () => { 
    const invalidBrkt = {
      ...brktToPost,
      games: -1,
    }
    const postedDiv = await postBrkt(invalidBrkt);
    expect(postedDiv).toBeNull();
  })

})
