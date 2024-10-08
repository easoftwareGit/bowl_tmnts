import axios, { AxiosError } from "axios";
import { baseDivsApi } from "@/lib/db/apiPaths";
import { testBaseDivsApi } from "../../../testApi";
import { divType, HdcpForTypes } from "@/lib/types/types";
import { initDiv } from "@/lib/db/initVals";
import { deleteAllTmntDivs, deleteDiv, postDiv, putDiv } from "@/lib/db/divs/divsAxios";
import { mockDivsToPost } from "../../../mocks/tmnts/twoDivs/mockDivs";

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
const oneDivUrl = url + "/div/";

describe("divsAxios", () => {

  describe("postDiv", () => {
    const divToPost = {
      ...initDiv,
      tmnt_id: "tmt_e134ac14c5234d708d26037ae812ac33",
      div_name: "Test Div",
      hdcp_per: 0.8,
      hdcp_from: 230,
    };

    const deletePostedDiv = async () => {
      const response = await axios.get(url);
      const divs = response.data.divs;
      const toDel = divs.find((d: divType) => d.div_name === "Test Div");
      if (toDel) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: oneDivUrl + toDel.id,
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    };

    let createdDiv = false;

    beforeAll(async () => {
      await deletePostedDiv();
    });

    beforeEach(() => {
      createdDiv = false;
    });

    afterEach(async () => {
      if (createdDiv) {
        await deletePostedDiv();
      }
    });

    it("should post a div", async () => {
      const postedDiv = await postDiv(divToPost);
      expect(postedDiv).not.toBeNull();
      if (!postedDiv) return;
      createdDiv = true;
      expect(postedDiv.id).toBe(divToPost.id);
      expect(postedDiv.tmnt_id).toBe(divToPost.tmnt_id);
      expect(postedDiv.div_name).toBe(divToPost.div_name);
      expect(postedDiv.hdcp_per).toBe(divToPost.hdcp_per);
      expect(postedDiv.hdcp_from).toBe(divToPost.hdcp_from);
      expect(postedDiv.int_hdcp).toBe(divToPost.int_hdcp);
      expect(postedDiv.hdcp_for).toBe(divToPost.hdcp_for);
      expect(postedDiv.sort_order).toBe(divToPost.sort_order);
    });
    it("should NOT post a div with invalid data", async () => {
      const invalidDiv = {
        ...divToPost,
        hdcp_from: -1,
      };
      const postedDiv = await postDiv(invalidDiv);
      expect(postedDiv).toBeNull();
    });
  });

  describe('putDiv', () => {
    const divToPut = {
      ...initDiv,
      id: "div_f30aea2c534f4cfe87f4315531cef8ef",
      tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
      div_name: "Test Div",
      hdcp_per: 0.9,
      hdcp_from: 220,
      int_hdcp: false, 
      hdcp_for: 'Series' as HdcpForTypes,
      sort_order: 1,
    }

    const putUrl = oneDivUrl + divToPut.id

    const resetDiv = {
      ...initDiv,
      id: "div_f30aea2c534f4cfe87f4315531cef8ef",
      tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
      div_name: "Scratch",
      hdcp_per: 0,
      hdcp_from: 230,
      int_hdcp: true, 
      hdcp_for: 'Game',
      sort_order: 1,
    }

    const doReset = async () => {
      try {
        const tmntJSON = JSON.stringify(resetDiv);
        const response = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: putUrl,
        });
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    };

    let didPut = false;

    beforeAll(async () => {
      await doReset();
    });

    beforeEach(() => {
      didPut = false;
    });

    afterEach(async () => {
    if (!didPut) return;
      await doReset();
    });

    it("should put a div", async () => {
      const puttedDiv = await putDiv(divToPut); 
      expect(puttedDiv).not.toBeNull();
      if (!puttedDiv) return;
      didPut = true;
      expect(puttedDiv?.id).toEqual(divToPut.id);
      expect(puttedDiv?.tmnt_id).toEqual(divToPut.tmnt_id);
      expect(puttedDiv?.div_name).toEqual(divToPut.div_name);
      expect(puttedDiv?.hdcp_per).toEqual(divToPut.hdcp_per);
      expect(puttedDiv?.hdcp_from).toEqual(divToPut.hdcp_from);
      expect(puttedDiv?.int_hdcp).toEqual(divToPut.int_hdcp);
      expect(puttedDiv?.hdcp_for).toEqual(divToPut.hdcp_for);
      expect(puttedDiv?.sort_order).toEqual(divToPut.sort_order);
    });
    it("should NOT put a div with invalid data", async () => {
      const invalidDiv = {
        ...divToPut,
        hdcp_from: -1,
      };
      const puttedDiv = await putDiv(invalidDiv);
      expect(puttedDiv).toBeNull();
    });
  })

  describe('deleteDiv', () => {
    // toDel is data from prisma/seeds.ts
    const toDel = {
      ...initDiv,
      id: "div_66d39a83d7a84a8c85d28d8d1b2c7a90",
      tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      div_name: "Women's",
      hdcp_per: 0.90,
      hdcp_from: 230,
      int_hdcp: true, 
      hdcp_for: 'Game',
      sort_order: 4,
    }
    const nonFoundId = "div_00000000000000000000000000000000";

    const rePostToDel = async () => {
      const response = await axios.get(url);
      const divs = response.data.divs;
      const foundToDel = divs.find(
        (d: divType) => d.id === toDel.id
      );
      if (!foundToDel) {
        try {
          const eventJSON = JSON.stringify(toDel);
          const rePostedResponse = await axios({
            method: "post",
            data: eventJSON,
            withCredentials: true,
            url: url,
          });          
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    }
    
    let didDel = false;

    beforeAll(async () => {     
      await rePostToDel();
    });

    beforeEach(() => {
      didDel = false;
    });

    afterEach(async () => {
      if (!didDel) {
        await rePostToDel();
      }
    });

    it("should delete a div", async () => {
      const deleted = await deleteDiv(toDel.id);
      expect(deleted).toBe(1);
      didDel = true;
    });
    it("should NOT delete a div when ID is not found", async () => {
      const deleted = await deleteDiv(nonFoundId);
      expect(deleted).toBe(-1);
    });
    it("should NOT delete a div when ID is invalid", async () => {
      const deleted = await deleteDiv('test');
      expect(deleted).toBe(-1);
    });
    it("should NOT delete a div when ID is valid, but to a div id", async () => {
      const deleted = await deleteDiv(toDel.tmnt_id);
    })
    it('should NOT delete a div when ID blank', async () => { 
      const deleted = await deleteDiv('');
      expect(deleted).toBe(-1);
    })
    it('should NOT delete a div when ID null', async () => { 
      const deleted = await deleteDiv(null as any);
      expect(deleted).toBe(-1);
    })
  });

  describe('deleteAllTmntDivs', () => { 

    const multiDivs = [...mockDivsToPost];

    const rePostToDel = async () => {
      const response = await axios.get(url);
      const divs = response.data.divs;
      const foundToDel = divs.find(
        (d: divType) => d.id === multiDivs[0].id
      );
      if (!foundToDel) {
        try {
          const postedDivs: divType[] = [];
          for await (const div of multiDivs) {
            const postedDiv = await postDiv(div);
            if (!postedDiv) return 
            postedDivs.push(postedDiv); 
          }
          console.log('postedDivs: ', postedDivs.length);
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    }

    let didDel = false;

    beforeAll(async () => {
      await rePostToDel();
    });

    beforeEach(async () => {
      if (didDel) {
        await rePostToDel();
      }      
    });

    afterEach(async () => {
      didDel = false;
    });

    afterAll(async () => {
      await deleteAllTmntDivs(multiDivs[0].tmnt_id);
    });

    it('should delete all divs for a tmnt', async () => { 
      const deleted = await deleteAllTmntDivs(multiDivs[0].tmnt_id);
      expect(deleted).toBe(2);
      didDel = true;
    })
    it('should NOT delete all divs for a tmnt when ID is invalid', async () => { 
      const deleted = await deleteAllTmntDivs('test');
      expect(deleted).toBe(-1);
    })
    it("should NOT delete all divs for a tmnt when ID is not found", async () => {
      const deleted = await deleteAllTmntDivs("tmt_00000000000000000000000000000000");
      expect(deleted).toBe(0);
    })
    it('should NOT delete all divs for a tmnt when ID is valid, but not a tmnt id', async () => { 
      const deleted = await deleteAllTmntDivs(multiDivs[0].id); // event it
      expect(deleted).toBe(-1);
    })

  })

});
