import axios, { AxiosError } from "axios";
import { basePotsApi } from "@/lib/db/apiPaths";
import { testBasePotsApi } from "../../../testApi";
import { PotCategories, potType } from "@/lib/types/types";
import { initPot } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postPot } from "@/lib/db/pots/potsAxios";

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

const url = testBasePotsApi.startsWith("undefined")
  ? basePotsApi
  : testBasePotsApi;   
const onePotUrl = url + "/pot/";    

describe('postPot', () => { 

  const deletePostedPot = async () => { 
    const response = await axios.get(url);
    const pots = response.data.pots;
    const toDel = pots.find((p: potType) => p.sort_order === 13);
    if (toDel) {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: onePotUrl + toDel.id          
        });        
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    }
  }

  const potToPost = {
    ...initPot,    
    squad_id: "sqd_3397da1adc014cf58c44e07c19914f72",
    div_id: "div_66d39a83d7a84a8c85d28d8d1b2c7a90",
    sort_order: 1,
    fee: '13',
    pot_type: "Game" as PotCategories,
  }

  let createdPot = false;

  beforeAll(async () => { 
    await deletePostedPot();
  })

  beforeEach(() => {
    createdPot = false;
  })

  afterEach(async () => {
    if (createdPot) {
      await deletePostedPot();
    }
  })

  it('should post a pot', async () => { 
    const postedPot = await postPot(potToPost);
    expect(postedPot).not.toBeNull();
    if (!postedPot) return;
    createdPot = true;
    expect(postedPot.squad_id).toBe(potToPost.squad_id);
    expect(postedPot.div_id).toBe(potToPost.div_id);
    expect(postedPot.fee).toBe(potToPost.fee);
    expect(postedPot.pot_type).toBe(potToPost.pot_type);
    expect(postedPot.sort_order).toBe(potToPost.sort_order);
    expect(isValidBtDbId(postedPot.id, "pot")).toBeTruthy();
  })
  it('should NOT post a pot with invalid data', async () => { 
    const invalidPot = {
      ...potToPost,
      fee: '-13',
    }
    const postedPot = await postPot(invalidPot);
    expect(postedPot).toBeNull();
  })
})