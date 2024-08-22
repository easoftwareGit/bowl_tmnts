import axios, { AxiosError } from "axios";
import { baseTmntsApi } from "@/db/apiPaths";
import { testBaseTmntsApi } from "../../../testApi";
import { tmntType, YearObj } from "@/lib/types/types";
import { initTmnt } from "@/db/initVals";
import { postSecret } from "@/lib/tools";
import { isValidBtDbId } from "@/lib/validation";
import { compareAsc } from "date-fns";
import { startOfTodayUTC } from "@/lib/dateTools";

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

describe('Tmnts - API: /api/tmnts', () => { 

  const testTmnt: tmntType = {
    ...initTmnt,
    id: "tmt_fd99387c33d9c78aba290286576ddce5",
    user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
    tmnt_name: "Gold Pin",
    bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
    start_date: new Date(Date.UTC(2022, 9, 23)),  // month is -1
    end_date: new Date(Date.UTC(2022, 9, 23)),    // month is -1
  }

  const blankTmnt = {
    id: "tmt_fd99387c33d9c78aba290286576ddce5",
    user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
  }

  const notFoundId = "tmt_01234567890123456789012345678901";
  const notFoundBowlId = "bwl_01234567890123456789012345678901";  
  const notFoundUserId = "usr_01234567890123456789012345678901";  
  const nonTmntId = "evt_01234567890123456789012345678901";
  
  const tmnt2Id = "tmt_56d916ece6b50e6293300248c6792316";
  const bowl2Id = 'bwl_8b4a5c35ad1247049532ff53a12def0a';
  const bowl3Id = 'bwl_ff4cd62b03f24017beea81c1d6e047e7';
  const user1Id = "usr_5bcefb5d314fff1ff5da6521a2fa7bde";
  const user2Id = "usr_516a113083983234fc316e31fb695b85";
    
  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const tmnts = response.data.tmnts;
      const toDel = tmnts.find((t: tmntType) => t.tmnt_name === 'Test Tournament');
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

    it('should get all tmnts', async () => {
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 10 rows in prisma/seed.ts
      expect(response.data.tmnts).toHaveLength(10);
    })

  })

  describe('GET tmnt lists by year - API: /api/tmnts/years/:year', () => {

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const tmnts = response.data.tmnts;
      const toDel = tmnts.find((t: tmntType) => t.tmnt_name === 'Test Tournament');
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

    it('should get array of years API: /api/tmnts/years/yyyy', async () => {
      const yearsUrl = url + "/years/2023";
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: yearsUrl,
      });
      expect(response.status).toBe(200);
      expect(response.data.years).toHaveLength(2);
      const years: YearObj[] = response.data.years;
      // years sorted newest to oldest
      expect(years[0].year).toBe('2023');
      expect(years[1].year).toBe('2022');
    })
    it('should get array of tmnt results API: /api/tmnts/results', async () => {
      const resultsUrl = url + "/results"
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: resultsUrl,
      });
      expect(response.status).toBe(200);
      // 9 rows for results in prisma/seed.ts
      expect(response.data.tmnts).toHaveLength(9);
    })
    it('should get array of tmnt results by year API: /api/tmnts/results/yyyy', async () => {
      const resultsUrl = url + "/results/2022";
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: resultsUrl,
      });
      expect(response.status).toBe(200);
      // 3 rows for results in prisma/seed.ts for 2022
      expect(response.data.tmnts).toHaveLength(3);
    })

    it('should get array of upcoming tmnts API: /api/tmnts/upcoming', async () => {
      const upcomingUrl = url + "/upcoming";
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: upcomingUrl,
      });
      expect(response.status).toBe(200);
      // 1 rows for upcoming in prisma/seed.ts
      expect(response.data.tmnts).toHaveLength(1);
    })

  })

  describe('POST', () => {

    const tmntToPost = {
      ...initTmnt,
      id: '',
      user_id: user1Id,
      tmnt_name: "Test Tournament",
      bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
      start_date: startOfTodayUTC(),
      end_date: startOfTodayUTC(),
    }

    let createdTmntId = '';

    beforeAll(async () => {
      const response = await axios.get(url);
      const tmnts = response.data.tmnts;
      const toDel = tmnts.find((t: tmntType) => t.tmnt_name === 'Test Tournament');
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
      createdTmntId = '';
    })

    afterEach(async () => {
      if (createdTmntId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdTmntId
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should create a new tmnt', async () => {
      const tmntJSON = JSON.stringify(tmntToPost);
      const response = await axios({
        method: "post",
        data: tmntJSON,
        withCredentials: true,
        url: url,
      });
      expect(response.status).toBe(201);
      const postedTmnt = response.data.tmnt;
      createdTmntId = postedTmnt.id;
      expect(postedTmnt.tmnt_name).toBe(tmntToPost.tmnt_name);
      expect(compareAsc(postedTmnt.start_date, tmntToPost.start_date)).toBe(0);
      expect(compareAsc(postedTmnt.end_date, tmntToPost.end_date)).toBe(0);
      expect(isValidBtDbId(postedTmnt.id, 'tmt')).toBeTruthy();
    })
    it('should create a new tmnt with provided tmnt_id', async () => { 
      const supIdTmnt = {
        ...tmntToPost,
        id: postSecret + notFoundId, // use valid ID 
      }
      const tmntJSON = JSON.stringify(supIdTmnt);
      const response = await axios({
        method: "post",
        data: tmntJSON,
        withCredentials: true,
        url: url,
      })
      expect(response.status).toBe(201);
      const postedTmnt = response.data.tmnt;
      createdTmntId = postedTmnt.id;
      expect(postedTmnt.id).toBe(notFoundId);
    })
    it('should not create a new tmnt with bowl_id that does not exist', async () => { 
      const invalidTmnt = {
        ...tmntToPost,
        bowl_id: notFoundBowlId,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with missing tmnt_name', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        tmnt_name: "",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with missing bowl_id', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        bowl_id: "",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with missing start_date', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        start_date: null as any,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with missing end_date', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        end_date: null as any,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with non data start_date', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        start_date: "test",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with non data end_date', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        end_date: "test",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with tmnt_name is too long', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        tmnt_name: "a".repeat(100),
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with invalid start_date', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        start_date: new Date(Date.UTC(1800, 0, 1)),  // month is -1
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with invalid end_date', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        end_date: new Date(Date.UTC(2300, 0, 1)),  // month is -1
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with invalid bowl_id', async () => { 
      const invalidTmnt = {
        ...tmntToPost,
        bowl_id: 'invalid',        
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with valid id, but not a bowl_id', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        bowl_id: nonTmntId,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with valid bowl_id, but bowl_id not found', async () => { 
      const invalidTmnt = {
        ...tmntToPost,
        bowl_id: notFoundBowlId,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with invalid user_id', async () => { 
      const invalidTmnt = {
        ...tmntToPost,
        user_id: 'invalid',
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with valid id, but not a user_id', async () => {
      const invalidTmnt = {
        ...tmntToPost,
        user_id: nonTmntId,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new tmnt with valid user_id, but user_id not found', async () => { 
      const invalidTmnt = {
        ...tmntToPost,
        user_id: notFoundUserId,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const response = await axios({
          method: "post",
          data: tmntJSON,
          withCredentials: true,
          url: url,
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })      
    it('should create a new tmnt with sanitized data', async () => {
      const toSanitizeTmnt = {
        ...tmntToPost,
        tmnt_name: "    <script>" + tmntToPost.tmnt_name + "</script>   ",
      }
      const tmntJSON = JSON.stringify(toSanitizeTmnt);
      const response = await axios({
        method: "post",
        data: tmntJSON,
        withCredentials: true,
        url: url,
      })
      expect(response.status).toBe(201);
      const postedTmnt = response.data.tmnt;
      createdTmntId = postedTmnt.id;
      expect(postedTmnt.tmnt_name).toBe(tmntToPost.tmnt_name);
      expect(compareAsc(postedTmnt.start_date, tmntToPost.start_date)).toBe(0);
      expect(compareAsc(postedTmnt.end_date, tmntToPost.end_date)).toBe(0);
      expect(isValidBtDbId(postedTmnt.id, 'tmt')).toBeTruthy();
    })
    
  })

  describe('GET by ID - API: API: /api/tmnts/:id', () => {

    it('should get a tmnt by ID', async () => {
      const response = await axios.get(url + "/" + testTmnt.id);
      const tmnt = response.data.tmnt;
      expect(response.status).toBe(200);
      expect(tmnt.id).toBe(testTmnt.id);
      expect(tmnt.tmnt_name).toBe(testTmnt.tmnt_name);
      expect(compareAsc(tmnt.start_date, testTmnt.start_date)).toBe(0);
      expect(compareAsc(tmnt.end_date, testTmnt.end_date)).toBe(0);
    })
    it('should NOT get a tmnt by ID when ID is invalid', async () => {
      try {
        const response = await axios.get(url + "/" + 'test');
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get a tmnt by ID when ID is valid, but not a tmnt ID', async () => {
      try {
        const response = await axios.get(url + "/" + nonTmntId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get a tmnt by ID when ID is not found', async () => {
      try {
        const response = await axios.get(url + "/" + notFoundId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })

  })

  describe('PUT by ID - API: API: /api/tmnts/:id', () => {

    const putTmnt = {
      ...testTmnt,
      tmnt_name: "Test Tournament",
      bowl_id: bowl2Id,
      user_id: user2Id,
      start_date: new Date(Date.UTC(2022, 10, 1)),  // month is -1
      end_date: new Date(Date.UTC(2022, 10, 1)),    // month is -1
    }

    const sampleTmnt = {
      ...initTmnt,
      id: '',
      tmnt_name: "Sample Tournament",
      bowl_id: bowl3Id,
      user_id: user1Id,
      start_date: new Date(Date.UTC(2022, 7, 1)),  // month is -1
      end_date: new Date(Date.UTC(2022, 7, 1)),    // month is -1
    }

    beforeAll(async () => {
      // make sure test tmnt is reset in database
      const tmntJSON = JSON.stringify(testTmnt);
      const putResponse = await axios({
        method: "put",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + testTmnt.id,
      })
    })

    afterEach(async () => {
      try {
        const tmntJSON = JSON.stringify(testTmnt);
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update a tmnt by ID', async () => {
      const tmntJSON = JSON.stringify(putTmnt);
      const putResponse = await axios({
        method: "put",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + testTmnt.id,
      })
      const tmnt = putResponse.data.tmnt;
      expect(putResponse.status).toBe(200);
      expect(tmnt.tmnt_name).toBe(putTmnt.tmnt_name);
      expect(tmnt.bowl_id).toBe(putTmnt.bowl_id);
      // for user_id, compare to testTmnt.user_id
      expect(tmnt.user_id).toBe(testTmnt.user_id);
      expect(compareAsc(tmnt.start_date, putTmnt.start_date)).toBe(0);
      expect(compareAsc(tmnt.end_date, putTmnt.end_date)).toBe(0);
    })
    it('should NOT update a tmnt with when ID is invalid', async () => {
      try {
        const tmntJSON = JSON.stringify(putTmnt);
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + 'test',
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt when ID is valid, but not a tmnt ID', async () => {
      try {
        const tmntJSON = JSON.stringify(putTmnt);
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + nonTmntId,
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when ID is not found', async () => {
      try {
        const tmntJSON = JSON.stringify(putTmnt);
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + notFoundId,
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID whne tmnt_name is missing', async () => {
      const invalidTmnt = {
        ...putTmnt,
        tmnt_name: "",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when bowl_id is missing', async () => {
      const invalidTmnt = {
        ...putTmnt,
        bowl_id: "",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when user_id is missing', async () => {
      const invalidTmnt = {
        ...putTmnt,
        user_id: "",
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when start_date is missing', async () => {
      const invalidTmnt = {
        ...putTmnt,
        start_date: null as any,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when end_date is missing', async () => {
      const invalidTmnt = {
        ...putTmnt,
        end_date: null as any,
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when tmnt_name is too long', async () => {
      const invalidTmnt = {
        ...putTmnt,
        tmnt_name: 'a'.repeat(256),
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
      }
      catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when start_date is after end_date', async () => {
      const invalidTmnt = {
        ...putTmnt,
        start_date: new Date(Date.UTC(2022, 10, 4)),  // month is -1
        end_date: new Date(Date.UTC(2022, 10, 2)),    // month is -1
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when bowl_id is invalid', async () => {
      const invalidTmnt = {
        ...putTmnt,
        bowl_id: 'test',
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when bowl_id is valid, but not a bowl ID', async () => {
      const invalidTmnt = {
        ...putTmnt,
        bowl_id: notFoundId, // valid tmnt ID, but not a user ID
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when bowl_id is not found', async () => {
      const invalidTmnt = {
        ...putTmnt,
        bowl_id: notFoundBowlId, 
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT update a tmnt by ID when user_id is invalid', async () => {
      const invalidTmnt = {
        ...putTmnt,
        user_id: 'test',
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT update a tmnt by ID when user_id is valid, but not a user ID', async () => {
      const invalidTmnt = {
        ...putTmnt,
        user_id: notFoundId, // valid tmnt ID, but not a user ID
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when start_date is invalid', async () => {
      const invalidTmnt = {
        ...putTmnt,
        start_date: new Date(Date.UTC(1800, 10, 1)),  // month is -1
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT update a tmnt by ID when end_date is invalid', async () => {
      const invalidTmnt = {
        ...putTmnt,
        end_date: new Date(Date.UTC(2300, 10, 1)),  // month is -1
      }
      const tmntJSON = JSON.stringify(invalidTmnt);
      try {
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
        expect(putResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should update a tmnt by ID with sanitized data', async () => {
      const toSanitizeTmnt = {
        ...putTmnt,
        tmnt_name: "    <script>" + sampleTmnt.tmnt_name + "</script>   ",
      }
      const tmntJSON = JSON.stringify(toSanitizeTmnt);
      const response = await axios({
        method: "put",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + testTmnt.id,
      })
      expect(response.status).toBe(200);
      const puttedTmnt = response.data.tmnt;
      expect(puttedTmnt.tmnt_name).toBe(sampleTmnt.tmnt_name);
    })

  })

  describe('PATCH by ID - API: API: /api/tmnts/:id', () => {

    beforeAll(async () => {
      // make sure test tmnt is reset in database
      const tmntJSON = JSON.stringify(testTmnt);
      const putResponse = await axios({
        method: "put",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + testTmnt.id,
      })
    })
      
    afterEach(async () => {
      try {
        const tmntJSON = JSON.stringify(testTmnt);
        const putResponse = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch a tmnt tmnt_name by ID', async () => {
      const patchTmnt = {
        ...blankTmnt,
        tmnt_name: 'patched tmnt name',
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankTmnt.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedTmnt = patchResponse.data.tmnt;
      expect(patchedTmnt.tmnt_name).toBe(patchTmnt.tmnt_name);
    })
    it('should patch a tmnt bowl_id by ID', async () => {
      const patchTmnt = {
        ...blankTmnt,
        bowl_id: bowl2Id,
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankTmnt.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedTmnt = patchResponse.data.tmnt;
      expect(patchedTmnt.bowl_id).toBe(patchTmnt.bowl_id);
    })
    it('should patch a tmnt start_date by ID', async () => {
      const patchTmnt = {
        ...blankTmnt,
        start_date: new Date(Date.UTC(2022, 9, 22)),  // month is -1
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankTmnt.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedTmnt = patchResponse.data.tmnt;
      expect(compareAsc(patchedTmnt.start_date, patchTmnt.start_date)).toBe(0);
    })
    it('should patch a tmnt end_date by ID', async () => {
      const patchTmnt = {
        ...blankTmnt,
        end_date: new Date(Date.UTC(2022, 9, 24)),  // month is -1
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankTmnt.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedTmnt = patchResponse.data.tmnt;
      expect(compareAsc(patchedTmnt.end_date, patchTmnt.end_date)).toBe(0);
    })
    it('should NOT patch a tmnt user_id by ID', async () => {
      const patchTmnt = {
        ...blankTmnt,
        user_id: user2Id,
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankTmnt.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedTmnt = patchResponse.data.tmnt;
      // for user_id, compare to blankTmnt.user_id
      expect(patchedTmnt.user_id).toBe(blankTmnt.user_id);
    })
    it('should NOT patch a tmnt when ID is invalid', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          tmnt_name: 'patched tmnt name',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + 'test',
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt when ID is not found', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          tmnt_name: 'patched tmnt name',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + notFoundId,
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt when ID is valid, but not a tmnt ID', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          tmnt_name: 'patched tmnt name',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + nonTmntId,
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when tmnt_name is missing', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          tmnt_name: '',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when user_id is missing', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          user_id: '',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when bowl_id is missing', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          bowl_id: '',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when start_date is missing', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          start_date: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when end_date is missing', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          end_date: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when tmnt_name is too long', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          tmnt_name: 'a'.repeat(101),
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when start_date is after end_date', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          start_date: new Date(Date.UTC(2022, 9, 24)),  // month is -1
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when start_date is too far in the past', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          start_date: new Date(Date.UTC(1800, 9, 24)),  // month is -1
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when end_date is too far in the future', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          end_date: new Date(Date.UTC(2300, 9, 24)),  // month is -1
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when bowl_id is invalid', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          bowl_id: 'invalid',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when bowl_id is valid, but not a bowl ID', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          bowl_id: notFoundId, // tmnt id
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not patch a tmnt by ID when bowl_id is not found', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          bowl_id: notFoundBowlId, // tmnt id
        } 
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when user_id is invalid', async () => { 
      try {
        const patchTmnt = {
          ...blankTmnt,
          user_id: 'invalid',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a tmnt by ID when user_id is valid, bit not a user ID', async () => {
      try {
        const patchTmnt = {
          ...blankTmnt,
          user_id: notFoundId, // tmnt id
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankTmnt.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should patch a tmnt by ID whith a sanitized tmnt_name', async () => {
      const patchTmnt = {
        ...blankTmnt,
        tmnt_name: "    <script>Patched Tmnt Name</script>   ",
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankTmnt.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedTmnt = patchResponse.data.tmnt;
      expect(patchedTmnt.tmnt_name).toBe("Patched Tmnt Name");
    })

  })

  describe('DELETE by ID - API: API: /api/tmnts/:id', () => { 

    const toDelTmnt = {
      ...initTmnt,
      id: "tmt_e134ac14c5234d708d26037ae812ac33",
      user_id: "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
      tmnt_name: "Gold Pin",
      bowl_id: "bwl_561540bd64974da9abdd97765fdb3659",
      start_date: new Date(Date.UTC(2024, 7, 19)),  // month is -1
      end_date: new Date(Date.UTC(2024, 7, 19)),    // month is -1
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return ;
      try {
        const restoredTmnt = {
          ...toDelTmnt,
          id: postSecret + 'tmt_e134ac14c5234d708d26037ae812ac33',
        }
        const tmntJSON = JSON.stringify(restoredTmnt);
        const response = await axios({
          method: 'post',
          data: tmntJSON,
          withCredentials: true,
          url: url
        })
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete a tmnt by ID', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelTmnt.id,
        })  
        didDel = true;
        expect(delResponse.status).toBe(200);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(200);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a tmnt by ID when ID is invalid', async () => {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + 'test',
        })  
        expect(delResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a tmnt by ID when ID is not found', async () => {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + notFoundId,
        })  
        expect(delResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a tmnt by ID when ID is valid, but not a tmnt ID', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonTmntId,
        })  
        expect(delResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a tmnt by ID when tmnt has child rows', async () => {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + testTmnt.id,
        })  
        expect(delResponse.status).toBe(409);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(409);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })

  })

})