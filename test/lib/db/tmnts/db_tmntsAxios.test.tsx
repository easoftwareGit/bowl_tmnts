import axios, { AxiosError } from "axios";
import { baseTmntsApi } from "@/lib/db/apiPaths";
import { testBaseTmntsApi } from "../../../testApi";
import { tmntType, YearObj } from "@/lib/types/types";
import { initTmnt } from "@/lib/db/initVals";
import { startOfTodayUTC } from "@/lib/dateTools";
import { postTmnt } from "@/lib/db/tmnts/tmntsAxios";
import { compareAsc } from "date-fns";
import { isValidBtDbId } from "@/lib/validation";

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

describe("tmntsAxios", () => {
  const user1Id = "usr_5bcefb5d314fff1ff5da6521a2fa7bde";

  describe("postTmnt", () => {
    const tmntToPost = {
      ...initTmnt,
      id: "",
      user_id: user1Id,
      tmnt_name: "Test Tournament",
      bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
      start_date: startOfTodayUTC(),
      end_date: startOfTodayUTC(),
    };

    let createdTmntId = "";

    beforeAll(async () => {
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
            url: url + "/" + toDel.id,
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    });

    beforeEach(() => {
      createdTmntId = "";
    });

    afterEach(async () => {
      if (createdTmntId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdTmntId,
          });
          console.log("deleted tmnt " + createdTmntId);
          createdTmntId = "";
        } catch (err) {
          if (err instanceof AxiosError) {
            console.log(err.message);
          } else {
            console.log(err);
          }
        }
      }
    });

    it("should post a tmnt", async () => {
      const postedTmnt = await postTmnt(tmntToPost);
      expect(postedTmnt).not.toBeNull();
      if (!postedTmnt) return;
      expect(postedTmnt).not.toBeNull();
      createdTmntId = postedTmnt.id;
      expect(postedTmnt.tmnt_name).toBe(tmntToPost.tmnt_name);
      expect(postedTmnt.user_id).toBe(tmntToPost.user_id);
      expect(postedTmnt.bowl_id).toBe(tmntToPost.bowl_id);
      expect(compareAsc(postedTmnt.start_date, tmntToPost.start_date)).toBe(0);
      expect(compareAsc(postedTmnt.end_date, tmntToPost.end_date)).toBe(0);
      expect(isValidBtDbId(postedTmnt.id, "tmt")).toBeTruthy();
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
      start_date: startOfTodayUTC(),
      end_date: startOfTodayUTC(),
    };

    const putUrl = url + "/" + tmntToPut.id;

    describe("putTmnt - success", () => {
      const resetTmnt = {
        ...initTmnt,
        id: "tmt_fd99387c33d9c78aba290286576ddce5",
        user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
        tmnt_name: "Gold Pin",
        bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
        start_date: new Date(Date.UTC(2022, 9, 23)), // month is -1
        end_date: new Date(Date.UTC(2022, 9, 23)), // month is -1
      };

      afterEach(async () => {
        const tmntJSON = JSON.stringify(resetTmnt);
        const response = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: putUrl,
        });
      });

      it("should put a tmnt", async () => {
        const tmntJSON = JSON.stringify(tmntToPut);
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: putUrl,
        });
        const tmnt = putResponse.data.tmnt;
        expect(putResponse.status).toBe(200);
        expect(tmnt.tmnt_name).toBe(tmntToPut.tmnt_name);
        expect(tmnt.bowl_id).toBe(tmntToPut.bowl_id);
        expect(tmnt.user_id).toBe(tmntToPut.user_id);
        expect(compareAsc(tmnt.start_date, tmntToPut.start_date)).toBe(0);
        expect(compareAsc(tmnt.end_date, tmntToPut.end_date)).toBe(0);
      });
    });

    describe("putTmnt - invalid data", () => {
      it("should NOT put a tmnt with invalid data", async () => {        
        try {
          const invalidTmnt = {
            ...tmntToPut,
            tmnt_name: "  ",
          };
          const tmntJSON = JSON.stringify(invalidTmnt);          
          const putResponse = await axios({
            method: "put",
            data: tmntJSON,
            withCredentials: true,
            url: putUrl,
          });
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }  
      });
    });
  });
});
