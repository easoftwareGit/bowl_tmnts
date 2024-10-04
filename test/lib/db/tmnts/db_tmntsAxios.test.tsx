import axios, { AxiosError } from "axios";
import { baseTmntsApi } from "@/lib/db/apiPaths";
import { testBaseTmntsApi } from "../../../testApi";
import { tmntType } from "@/lib/types/types";
import { initTmnt } from "@/lib/db/initVals";
import { deleteTmnt, postTmnt, putTmnt } from "@/lib/db/tmnts/tmntsAxios";
import { compareAsc, startOfToday } from "date-fns";
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

const url = testBaseTmntsApi.startsWith("undefined")
  ? baseTmntsApi
  : testBaseTmntsApi;
const oneTmntUrl = url + "/tmnt/";

describe("tmntsAxios", () => {  
  const user1Id = "usr_5bcefb5d314fff1ff5da6521a2fa7bde";

  describe("postTmnt", () => {
    const tmntToPost = {
      ...initTmnt,      
      user_id: user1Id,
      tmnt_name: "Test Tournament",
      bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
      start_date: startOfToday(),
      end_date: startOfToday()
    };

    let createdTmnt = false;

    const deletePostedTmnt = async () => { 
      const response = await axios.get(url);
      const tmnts = response.data.tmnts;
      const toDel = tmnts.find(
        (t: tmntType) => t.tmnt_name === "Test Tournament"
      );
      if (toDel) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: oneTmntUrl + toDel.id,
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    }

    beforeAll(async () => {
      await deletePostedTmnt();
    });

    beforeEach(() => {
      createdTmnt = false;
    });

    afterEach(async () => {
      if (createdTmnt) {
        await deletePostedTmnt();
      }
    });

    it("should post a tmnt", async () => {
      const postedTmnt = await postTmnt(tmntToPost);
      expect(postedTmnt).not.toBeNull();
      if (!postedTmnt) return;
      expect(postedTmnt).not.toBeNull();
      createdTmnt = true;
      expect(postedTmnt.id).toBe(tmntToPost.id);
      expect(postedTmnt.tmnt_name).toBe(tmntToPost.tmnt_name);
      expect(postedTmnt.user_id).toBe(tmntToPost.user_id);
      expect(postedTmnt.bowl_id).toBe(tmntToPost.bowl_id);
      const postedStartDate = new Date(postedTmnt.start_date);      
      expect(compareAsc(postedStartDate, tmntToPost.start_date)).toBe(0);
      const postedEndDate = new Date(postedTmnt.end_date);
      expect(compareAsc(postedEndDate, tmntToPost.end_date)).toBe(0);      
    });

    it("should NOT post a tmnt with invalid data", async () => {
      const invalidTmnt = {
        ...tmntToPost,
        tmnt_name: "  ",
      };
      const postedTmnt = await postTmnt(invalidTmnt);
      expect(postedTmnt).toBeNull();
    });
  });

  describe("putTmnt", () => {
    const tmntToPut = {
      ...initTmnt,
      id: "tmt_fd99387c33d9c78aba290286576ddce5",
      user_id: user1Id,
      tmnt_name: "Test Tournament",
      bowl_id: "bwl_8b4a5c35ad1247049532ff53a12def0a",
      start_date: startOfToday(),
      end_date: startOfToday(),
    };

    const putUrl = oneTmntUrl + tmntToPut.id;
    
    const resetTmnt = {
      ...initTmnt,
      id: "tmt_fd99387c33d9c78aba290286576ddce5",
      user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
      tmnt_name: "Gold Pin",
      bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
      start_date: startOfDayFromString('2022-10-24') as Date,
      end_date: startOfDayFromString('2022-10-24') as Date,
    };

    const doResetTmnt = async () => {
      const tmntJSON = JSON.stringify(resetTmnt);
      const response = await axios({
        method: "put",
        data: tmntJSON,
        withCredentials: true,
        url: putUrl,
      });
    };

    let didPut = false;

    beforeAll(async () => {
      await doResetTmnt();
    });

    beforeEach = () => {
      didPut = false;
    };

    afterEach(async () => {
      if (didPut) {
        await doResetTmnt();
      }
    });

    it("should put a tmnt", async () => {
      const puttedTmnt = await putTmnt(tmntToPut);
      expect(puttedTmnt).not.toBeNull();
      if (!puttedTmnt) return;
      didPut = true;
      expect(puttedTmnt.tmnt_name).toBe(tmntToPut.tmnt_name);
      expect(puttedTmnt.bowl_id).toBe(tmntToPut.bowl_id);
      expect(puttedTmnt.user_id).toBe(tmntToPut.user_id);
      expect(compareAsc(puttedTmnt.start_date, tmntToPut.start_date)).toBe(0);
      expect(compareAsc(puttedTmnt.end_date, tmntToPut.end_date)).toBe(0);
    });

    it("should NOT put a tmnt with invalid data", async () => {
      const invalidTmnt = {
        ...tmntToPut,
        tmnt_name: "",
      };
      const puttedTmnt = await putTmnt(invalidTmnt);
      expect(puttedTmnt).toBeNull();
    });

  });

  describe('deleteTmnt', () => {     
    // toDel is data from prisma/seeds.ts    
    const toDel = {
      ...initTmnt,
      id: "tmt_e134ac14c5234d708d26037ae812ac33",
      user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
      tmnt_name: "Gold Pin",
      bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
      start_date: startOfDayFromString('2025-08-19') as Date,
      end_date: startOfDayFromString('2025-08-19') as Date,
    }                         
    const nonFoundId = "tmt_00000000000000000000000000000000";

    const rePostToDel = async () => {
      const response = await axios.get(url);
      const tmnts = response.data.tmnts;
      const foundToDel = tmnts.find(
        (t: tmntType) => t.id === toDel.id
      );
      if (!foundToDel) {
        try {
          const tmntJSON = JSON.stringify(toDel);
          const rePostedResponse = await axios({
            method: "post",
            data: tmntJSON,
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

    beforeEach = () => {
      didDel = false;
    };

    afterEach(async () => {
      if (didDel) {
        await rePostToDel();
      } 
    });

    it('should delete a tmnt by ID', async () => {
      const deletedTmnt = await deleteTmnt(toDel.id);
      expect(deletedTmnt).toBe(true);
      didDel = true;
    });
    it('should NOT delete a tmnt that does not exist', async () => {
      const deletedTmnt = await deleteTmnt(nonFoundId);  
      expect(deletedTmnt).toBe(false);
    })
  })

});
