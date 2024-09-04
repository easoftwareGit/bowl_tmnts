import axios, { AxiosError } from "axios";
import { baseDivsApi } from "@/lib/db/apiPaths";
import { testBaseDivsApi } from "../../../testApi";
import { divType } from "@/lib/types/types";
import { initDiv } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postDiv } from "@/lib/db/divs/divsAxios";

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

const url = testBaseDivsApi.startsWith("undefined")
  ? baseDivsApi
  : testBaseDivsApi;   

describe('postDiv', () => { 

  const divToPost = {
    ...initDiv,
    id: '',
    tmnt_id: 'tmt_e134ac14c5234d708d26037ae812ac33',
    div_name: 'Test Div',
    hdcp_per: 0.80,
    hdcp_from: 230,    
  }

  let createdDivId = '';

  beforeAll(async () => { 
    const response = await axios.get(url);
    const divs = response.data.divs;
    const toDel = divs.find((d: divType) => d.div_name === 'Test Div');
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
    createdDivId = "";
  })

  afterEach(async () => {
    if (createdDivId) {
      const delResponse = await axios({
        method: "delete",
        withCredentials: true,
        url: url + "/" + createdDivId,
      });
    }
    createdDivId = "";
  })

  it('should post a div', async () => { 
    const postedDiv = await postDiv(divToPost);
    expect(postedDiv).not.toBeNull();
    if(!postedDiv) return;
    createdDivId = postedDiv.id;
    expect(postedDiv.tmnt_id).toBe(divToPost.tmnt_id);
    expect(postedDiv.div_name).toBe(divToPost.div_name);    
    expect(postedDiv.hdcp_per).toBe(divToPost.hdcp_per);
    expect(postedDiv.hdcp_from).toBe(divToPost.hdcp_from);
    expect(postedDiv.int_hdcp).toBe(divToPost.int_hdcp);
    expect(postedDiv.hdcp_for).toBe(divToPost.hdcp_for);
    expect(postedDiv.sort_order).toBe(divToPost.sort_order);
    expect(isValidBtDbId(postedDiv.id, 'div')).toBeTruthy();
  })
  it('should NOT post a div with invalid data', async () => { 
    const invalidDiv = {
      ...divToPost,
      hdcp_from: -1,
    }
    const postedDiv = await postDiv(invalidDiv);
    expect(postedDiv).toBeNull();
  })

})