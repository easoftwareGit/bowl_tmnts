import axios, { AxiosError } from "axios";
import { baseElimsApi } from "@/lib/db/apiPaths";
import { testBaseElimsApi } from "../../../testApi";
import { elimType } from "@/lib/types/types";
import { initElim } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postElim } from "@/lib/db/elims/elimsAxios";

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

const url = testBaseElimsApi.startsWith("undefined")
  ? baseElimsApi
  : testBaseElimsApi;
const oneElimUrl = url + "/elim/";
  
describe('postElim', () => {

  const elimToPost = {
    ...initElim,    
    squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
    div_id: 'div_66d39a83d7a84a8c85d28d8d1b2c7a90',
    start: 1,
    games: 3,
    fee: '13',
    sort_order: 13
  }

  let createdElim = false;

  const deletePostedElim = async () => { 
    const response = await axios.get(url);
    const elims = response.data.elims;
    const toDel = elims.find((e: elimType) => e.sort_order === 13);
    if (toDel) {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: oneElimUrl + toDel.id          
        });               
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    }
  }

  beforeAll(async () => { 
    await deletePostedElim();
  })

  beforeEach(() => {
    createdElim = false;
  })

  afterEach(async () => {
    if (createdElim) {
      await deletePostedElim();
    }
  })

  it('should post an elim', async () => { 
    const postedElim = await postElim(elimToPost);
    expect(postedElim).not.toBeNull();
    if(!postedElim) return;
    createdElim = true
    expect(postedElim.id).toBe(elimToPost.id);
    expect(postedElim.squad_id).toBe(elimToPost.squad_id);
    expect(postedElim.div_id).toBe(elimToPost.div_id);    
    expect(postedElim.start).toBe(elimToPost.start);
    expect(postedElim.games).toBe(elimToPost.games);
    expect(postedElim.fee).toBe(elimToPost.fee);    
    expect(postedElim.sort_order).toBe(elimToPost.sort_order);    
  })
  it('should NOT post a elim with invalid data', async () => { 
    const invalidElim = {
      ...elimToPost,
      games: -1,
    }
    const postedElim = await postElim(invalidElim);
    expect(postedElim).toBeNull();
  })

})