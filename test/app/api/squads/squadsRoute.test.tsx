import axios, { AxiosError } from "axios";
import { baseSquadsApi } from "@/lib/db/apiPaths";
import { testBaseSquadsApi } from "../../../testApi";
import { squadType } from "@/lib/types/types";
import { initSquad } from "@/lib/db/initVals";
import { postSecret } from "@/lib/tools";
import { isValidBtDbId } from "@/lib/validation";
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

const notFoundId = "sqd_01234567890123456789012345678901";
const notfoundEventId = "evt_01234567890123456789012345678901";
const nonSquadId = "usr_01234567890123456789012345678901";  
const squad4Id = 'sqd_796c768572574019a6fa79b3b1c8fa57';
const event2Id = 'evt_dadfd0e9c11a4aacb87084f1609a0afd';
const event3Id = 'evt_06055deb80674bd592a357a4716d8ef2';

describe('Squads - API: /api/squads', () => { 

  const testSquad: squadType = {
    ...initSquad,
    id: "sqd_7116ce5f80164830830a7157eb093396",
    event_id: "evt_cb97b73cb538418ab993fc867f860510",
    squad_name: "Squad 1",
    squad_date: new Date(Date.UTC(2022, 9, 23)),  // month is -1 
    squad_time: null,
    games: 6,
    lane_count: 12,
    starting_lane: 29,
    sort_order: 1,
  }  

  const blankSquad = {
    id: "sqd_7116ce5f80164830830a7157eb093396",
    event_id: "evt_cb97b73cb538418ab993fc867f860510",
  }

  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
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

    it('should get all squads', async () => { 
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 7 rows in prisma/seed.ts
      expect(response.data.squads).toHaveLength(7);
    })

  })

  describe('GET squad lists API: /api/squads/event/:id', () => { 

    beforeAll(async () => {          
      // if row left over from post test, then delete it
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

    it('should get all squads for an event', async () => { 
      // const values taken from prisma/seed.ts
      const multiSquadEventId = "evt_06055deb80674bd592a357a4716d8ef2";
      const eventSquadId1 = 'sqd_42be0f9d527e4081972ce8877190489d';
      const eventSquadId2 = 'sqd_796c768572574019a6fa79b3b1c8fa57';

      const multiDivUrl = url + '/event/' + multiSquadEventId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiDivUrl
      })
      expect(response.status).toBe(200);
      // 2 rows for tmnt in prisma/seed.ts
      expect(response.data.squads).toHaveLength(2);
      const squads: squadType[] = response.data.squads;
      // query in /api/divs/tmnt GET sorts by sort_order
      expect(squads[0].id).toBe(eventSquadId1);
      expect(squads[1].id).toBe(eventSquadId2);      
    })
  
  })

  describe('POST', () => {

    const squadToPost: squadType = {
      ...initSquad,
      id: "",
      event_id: "evt_c0b2bb31d647414a9bea003bd835f3a0",
      squad_name: "Test Squad",
      squad_date: new Date(Date.UTC(2023, 1, 2)),  // month is -1
      squad_time: '09:00 AM',
      games: 8,
      lane_count: 20,
      starting_lane: 3,
      sort_order: 1,
    }

    let createdSquadId = "";

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
      createdSquadId = '';
    })

    afterEach(async () => {
      if (createdSquadId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdSquadId
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should create a new squad', async () => { 
      const squadJSON = JSON.stringify(squadToPost);
      const response = await axios({
        method: "post",
        withCredentials: true,
        url: url,
        data: squadJSON
      });
      expect(response.status).toBe(201);
      const postedSquad = response.data.squad;
      createdSquadId = postedSquad.id;
      expect(postedSquad.event_id).toBe(squadToPost.event_id);
      expect(postedSquad.squad_name).toBe(squadToPost.squad_name);
      expect(postedSquad.games).toBe(squadToPost.games);
      expect(postedSquad.lane_count).toBe(squadToPost.lane_count);
      expect(postedSquad.starting_lane).toBe(squadToPost.starting_lane);
      expect(postedSquad.sort_order).toBe(squadToPost.sort_order);
      expect(isValidBtDbId(postedSquad.id, 'sqd')).toBeTruthy();
    })      
    it('should create a new squad with the provided squad id', async () => { 
      const supIdSquad = {
        ...squadToPost,
        id: postSecret + notFoundId, // use valid ID 
      }
      const squadJSON = JSON.stringify(supIdSquad);
      const response = await axios({
        method: "post",
        data: squadJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedSquad = response.data.squad;
      createdSquadId = postedSquad.id;
      expect(postedSquad.id).toBe(notFoundId);
    })
    it('should create a new squad without a squad time', async () => { 
      const noTimeSuqd = {
        ...squadToPost,
        squad_time: '',
      }
      const squadJSON = JSON.stringify(noTimeSuqd);
      const response = await axios({
        method: "post",
        data: squadJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedSquad = response.data.squad;
      createdSquadId = postedSquad.id;
      expect(postedSquad.squad_time).toBe('');
    })
    it('should NOT create a new squad when event_id is empty', async () => { 
      const invalidSquad = {
        ...squadToPost,
        event_id: '',        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when squad_name is empty', async () => { 
      const invalidSquad = {
        ...squadToPost,
        squad_name: '',        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when squad_date is empty', async () => { 
      const invalidSquad = {
        ...squadToPost,
        squad_date: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when games is empty', async () => { 
      const invalidSquad = {
        ...squadToPost,
        games: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when lane_count is empty', async () => {
      const invalidSquad = {
        ...squadToPost,
        lane_count: null as any,                
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when starting_lane is empty', async () => { 
      const invalidSquad = {
        ...squadToPost,
        starting_lane: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when sort_order is empty', async () => { 
      const invalidSquad = {
        ...squadToPost,
        sort_order: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when event_id is invalid', async () => { 
      const invalidSquad = {
        ...squadToPost,
        event_id: 'invalid',        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when event_id is valid, but not an event id', async () => { 
      const invalidSquad = {
        ...squadToPost,
        event_id: nonSquadId,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when event_id does not exist', async () => { 
      const invalidSquad = {
        ...squadToPost,
        event_id: notfoundEventId,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new squad when squad_name is too long', async () => { 
      const invalidSquad = {
        ...squadToPost,
        squad_name: 'a'.repeat(51),        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when squad_date it too far in the past', async () => { 
      const invalidSquad = {
        ...squadToPost,
        squad_date: new Date(Date.UTC(1800, 10, 1)),  // month is -1   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when squad_date is too far in the future', async () => { 
      const invalidSquad = {
        ...squadToPost,
        squad_date: new Date(Date.UTC(2300, 10, 1)),  // month is -1   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when squad_time is invalid', async () => { 
      const invalidSquad = {
        ...squadToPost,
        squad_time: '13:00 PM',   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when games is too small', async () => { 
      const invalidSquad = {
        ...squadToPost,
        games: 0,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when games is too large', async () => { 
      const invalidSquad = {
        ...squadToPost,
        games: 100,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when games is not an integer', async () => { 
      const invalidSquad = {
        ...squadToPost,
        games: 5.5,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when starting_lane is too small', async () => { 
      const invalidSquad = {
        ...squadToPost,
        starting_lane: 0,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when starting_lane is too large', async () => { 
      const invalidSquad = {
        ...squadToPost,
        starting_lane: 201,   
      } 
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when starting_lane is even', async () => { 
      const invalidSquad = {
        ...squadToPost,
        starting_lane: 2,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when starting_lane is not an integer', async () => { 
      const invalidSquad = {
        ...squadToPost,
        starting_lane: 1.4,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when lane_count is too small', async () => { 
      const invalidSquad = {
        ...squadToPost,
        lane_count: 0,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when lane_count is too large', async () => { 
      const invalidSquad = {
        ...squadToPost,
        lane_count: 202,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when lane_count is odd', async () => { 
      const invalidSquad = {
        ...squadToPost,
        lane_count: 3,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when lane_count is not an integer', async () => { 
      const invalidSquad = {
        ...squadToPost,
        lane_count: 3.3,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when sort_order is too small', async () => { 
      const invalidSquad = {
        ...squadToPost,
        sort_order: 0,   
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new squad when sort_order is too large', async () => {
      const invalidSquad = {
        ...squadToPost,
        sort_order: 1234567,
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should not create a new squad when event_id + squad_name is not unique', async () => { 
      const invalidSquad = {
        ...squadToPost,
        event_id: event2Id,
        squad_name: "Squad 1",
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "post",
          data: squadJSON,
          withCredentials: true,
          url: url
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
    it('should create a new squad with sanitized data', async () => { 
      const toSanitizeSquad = {
        ...squadToPost,
        squad_name: "    <script>" + squadToPost.squad_name + "</script>   ",
      }
      const squadJSON = JSON.stringify(toSanitizeSquad);      
      const response = await axios({
        method: "post",
        data: squadJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedSquad = response.data.squad;
      createdSquadId = postedSquad.id;      
      expect(postedSquad.squad_name).toBe(squadToPost.squad_name);
    })

  })

  describe('GET by ID - API: /api/squads/[id]', () => { 

    it('should get squad by ID', async () => { 
      const response = await axios.get(url + "/" + testSquad.id);
      const squad = response.data.squad;
      expect(response.status).toBe(200);
      expect(squad.id).toBe(testSquad.id);
      expect(squad.event_id).toBe(testSquad.event_id);
      expect(squad.squad_name).toBe(testSquad.squad_name);
      expect(compareAsc(squad.squad_date, testSquad.squad_date)).toBe(0);      
      expect(squad.squad_time).toBe(null);
      expect(squad.games).toBe(testSquad.games);      
      expect(squad.lane_count).toBe(testSquad.lane_count);
      expect(squad.starting_lane).toBe(testSquad.starting_lane);
      expect(squad.sort_order).toBe(testSquad.sort_order);
    })
    it('should NOT get a squad by ID when ID is invalid', async () => {
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
    it('should NOT get a squad by ID when ID is valid, but not a squad ID', async () => {
      try {
        const response = await axios.get(url + "/" + nonSquadId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get a squad by ID when ID is not found', async () => {
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

  describe('PUT by ID - API: /api/squads/[id]', () => { 

    const putSquad = {
      ...testSquad,      
      event_id: "evt_06055deb80674bd592a357a4716d8ef2",
      squad_name: "Test Squad",
      squad_date: new Date(Date.UTC(2022, 6, 7)),  // month is -1 
      squad_time: '11:00 AM',
      games: 5,
      lane_count: 20,
      starting_lane: 1,
      sort_order: 4,
    }

    const sampleSquad = {
      ...initSquad,
      event_id: "evt_06055deb80674bd592a357a4716d8ef2",
      squad_name: "Test Squad",
      squad_date: new Date(Date.UTC(2022, 5, 6)),  // month is -1 
      squad_time: '09:00 AM',
      games: 8,
      lane_count: 16,
      starting_lane: 5,
      sort_order: 8,
    }

    beforeAll(async () => {
      // make sure test squad is reset in database
      const squadJSON = JSON.stringify(testSquad);
      const putResponse = await axios({
        method: "put",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + testSquad.id,
      })
    })

    afterEach(async () => {
      try {
        const squadJSON = JSON.stringify(testSquad);
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update a squad by ID', async () => {
      const squadJSON = JSON.stringify(putSquad);
      const putResponse = await axios({
        method: "put",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + testSquad.id,
      })
      expect(putResponse.status).toBe(200);
      const squad = putResponse.data.squad;
      // did not update tmnt_id
      expect(squad.event_id).toBe(testSquad.event_id);
      // all other fields updated
      expect(squad.squad_name).toBe(putSquad.squad_name);
      expect(compareAsc(squad.squad_date, putSquad.squad_date)).toBe(0);      
      expect(squad.squad_time).toBe(putSquad.squad_time);
      expect(squad.games).toBe(putSquad.games);
      expect(squad.lane_count).toBe(putSquad.lane_count);
      expect(squad.starting_lane).toBe(putSquad.starting_lane);
      expect(squad.sort_order).toBe(putSquad.sort_order);
    })
    it('should update a squad by ID when just squad_time is empty', async () => { 
      const noTimeSquad = {
        ...putSquad,
        squad_time: '',
      }
      const squadJSON = JSON.stringify(noTimeSquad);
      const putResponse = await axios({
        method: "put",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + testSquad.id,
      })
      expect(putResponse.status).toBe(200);
      const squad = putResponse.data.squad;
      expect(squad.squad_time).toBe(noTimeSquad.squad_time);
    })
    it('should NOT update a squad by ID when ID is invalid', async () => {
      try {
        const squadJSON = JSON.stringify(putSquad);
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
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
    it('should NOT update a squad by ID when ID is valid, but not a squad ID', async () => { 
      try {
        const squadJSON = JSON.stringify(putSquad);
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + nonSquadId,
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
    it('should NOT update a squad by ID when ID is not found.', async () => { 
      try {
        const squadJSON = JSON.stringify(putSquad);
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
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
    it('should NOT update a squad by ID when squad_name is missing', async () => { 
      const invalidSquad = {
        ...putSquad,
        squad_name: '',
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when squad_date is missing', async () => { 
      const invalidSquad = {
        ...putSquad,
        squad_date: null as any,
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when games is missing', async () => { 
      const invalidSquad = {
        ...putSquad,
        games: null as any,
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when starting_lane is missing', async () => { 
      const invalidSquad = {
        ...putSquad,
        starting_lane: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when lane_count is missing', async () => { 
      const invalidSquad = {
        ...putSquad,
        lane_count: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when sort_order is missing', async () => { 
      const invalidSquad = {
        ...putSquad,
        sort_order: null as any,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when squad_name is too long', async () => { 
      const invalidSquad = {
        ...putSquad,
        squad_name: 'a'.repeat(51),        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when squad_date to too far in the past', async () => { 
      const invalidSquad = {
        ...putSquad,
        squad_date: new Date(Date.UTC(1800, 10, 1)),        
      } 
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when squad_date to too far in the future', async () => { 
      const invalidSquad = {
        ...putSquad,
        squad_date: new Date(Date.UTC(2300, 10, 1)),        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when squad_time is invalid', async () => { 
      const invalidSquad = {
        ...putSquad,
        squad_time: '24:01',        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when games is too small', async () => { 
      const invalidSquad = {
        ...putSquad,
        games: 0,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when games is too large', async () => { 
      const invalidSquad = {
        ...putSquad,
        games: 101,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when lane_count is too small', async () => { 
      const invalidSquad = {
        ...putSquad,
        lane_count: 0,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when lane_count is too large', async () => { 
      const invalidSquad = {
        ...putSquad,
        lane_count: 202,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when lane_count is odd', async () => { 
      const invalidSquad = {
        ...putSquad,
        lane_count: 5,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when lane_count is not an integer', async () => { 
      const invalidSquad = {
        ...putSquad,
        lane_count: 5.5,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when starting_lane is too small', async () => { 
      const invalidSquad = {
        ...putSquad,
        starting_lane: 0,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when starting_lane is too large', async () => { 
      const invalidSquad = {
        ...putSquad,
        starting_lane: 201,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when starting_lane is even', async () => {
      const invalidSquad = {
        ...putSquad,
        starting_lane: 4,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when starting_lane is not an integer', async () => { 
      const invalidSquad = {
        ...putSquad,
        starting_lane: 4.4,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when sort_order is too small', async () => { 
      const invalidSquad = {
        ...putSquad,
        sort_order: 0,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when sort_order is too large', async () => { 
      const invalidSquad = {
        ...putSquad,
        sort_order: 1234567,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a squad by ID when sort_order is not an integer', async () => { 
      const invalidSquad = {
        ...putSquad,
        sort_order: 4.4,        
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
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
    it('should NOT update a new squad when event_id + squad_name is not unique', async () => { 
      const invalidSquad = {
        ...initSquad,
        id: squad4Id,
        event_id: event3Id,
        squad_name: "A Squad",
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + invalidSquad.id,
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
    it('should update a squad by ID with sanitized data', async () => { 
      const toSanitizeSquad = {
        ...putSquad,
        squad_name: "    <script>" + sampleSquad.squad_name + "</script>   ",
      }
      const squadJSON = JSON.stringify(toSanitizeSquad);
      const putResponse = await axios({
        method: "put",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + testSquad.id,
      })
      expect(putResponse.status).toBe(200);
      expect(putResponse.data.squad.squad_name).toBe(sampleSquad.squad_name);
    })

  })

  describe('PATCH by ID - API: /api/squads/:id', () => { 

    beforeAll(async () => {
      // make sure test squad is reset in database
      const squadJSON = JSON.stringify(testSquad);
      const putResponse = await axios({
        method: "put",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + testSquad.id,
      })
    })
      
    afterEach(async () => {
      try {
        const squadJSON = JSON.stringify(testSquad);
        const putResponse = await axios({
          method: "put",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + testSquad.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch squad_name in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        squad_name: 'Patched Squad'
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.squad_name).toBe(patchSquad.squad_name);
    })
    it('should patch squad_date in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        squad_date: new Date(Date.UTC(2022, 9, 22)),  // month is -1
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(compareAsc(patchedSquad.squad_date, patchSquad.squad_date)).toBe(0);
    })
    it('should patch squad_time in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        squad_time: '12:30'
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.squad_time).toBe(patchSquad.squad_time);
    })
    it('should patch games in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        games: 5
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.games).toBe(patchSquad.games);
    })
    it('should patch lane_count in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        lane_count: 10
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.lane_count).toBe(patchSquad.lane_count);
    })
    it('should patch starting_lane in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        starting_lane: 1
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.starting_lane).toBe(patchSquad.starting_lane);
    })
    it('should patch sort_order in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        sort_order: 10
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.sort_order).toBe(patchSquad.sort_order);
    })
    it('should NOT patch event_id in a squad by ID', async () => {
      const patchSquad = {
        ...blankSquad,
        event_id: event2Id
      }
      const squadJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: squadJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      // test vs blankSquad, not patchSquad
      expect(patchedSquad.event_id).toBe(blankSquad.event_id);
    })
    it('should NOT patch a squad when ID is invalid', async () => {
      try {
        const patchTmnt = {
          ...blankSquad,
          squad_name: 'Patched Squad',
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
    it('should NOT patch a squad when ID is not found', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_name: 'Patched Squad',
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
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
    it('should NOT patch a squad when ID is valid, but not a squad ID', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_name: 'Patched Squad',
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + nonSquadId,
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
    it('should NOT patch a squad when event_id is blank', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          event_id: '',
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when squad_name is blank', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_name: '',
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when squad_date is null', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_date: null,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when games is null', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          games: null,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when lane_count is null', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          lane_count: null,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when starting_lane is null', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          starting_lane: null,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when sort_order is null', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          sort_order: null,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when squad_name is too long', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_name: 'a'.repeat(256),
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when squad date is in too far in the past', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_date: new Date(Date.UTC(1800, 2, 2)),  // month is -1 ,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when squad date is in too far in the future', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_date: new Date(Date.UTC(2300, 2, 2)),  // month is -1 ,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when squad_time is invalid', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          squad_time: '13:00 PM',
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when games is too low', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          games: 0,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when games is too high', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          games: 100,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when games is not an integer', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          games: 5.5,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when lane_count is too low', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          lane_count: 0,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when lane_count is too high', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          lane_count: 202,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when lane_count is odd', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          lane_count: 13,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when lane_count is not an integer', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          lane_count: 13.5,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when starting_lane is too low', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          starting_lane: 0,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when starting_lane is too high', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          starting_lane: 202,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when starting_lane is even', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          starting_lane: 12,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when starting_lane is not an integer', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          starting_lane: 12.5,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when sort_order is too low', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          sort_order: 0,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when sort_order is too high', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          sort_order: 1234567,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a squad when sort_order is not an integer', async () => {
      try {
        const patchSquad = {
          ...blankSquad,
          sort_order: 5.5,
        }
        const squadJSON = JSON.stringify(patchSquad);
        const patchResponse = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + blankSquad.id,
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
    it('should NOT patch a new squad when event_id + squad_name is not unique', async () => { 
      const invalidSquad = {
        ...blankSquad,
        id: squad4Id,
        event_id: event3Id,
        squad_name: "A Squad",
      }
      const squadJSON = JSON.stringify(invalidSquad);
      try {
        const response = await axios({
          method: "patch",
          data: squadJSON,
          withCredentials: true,
          url: url + "/" + invalidSquad.id,
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
    it('should patch a squad with a sanitzed squad name', async () => { 
      const patchSquad = {
        ...blankSquad,
        squad_name: "    <script>Patched Squad</script>   ",
      }
      const tmntJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.squad_name).toBe("Patched Squad");
    })
    it('should patch a squad with a blank squad_time', async () => { 
      const patchSquad = {
        ...blankSquad,
        squad_time: "",
      }
      const tmntJSON = JSON.stringify(patchSquad);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankSquad.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedSquad = patchResponse.data.squad;
      expect(patchedSquad.squad_time).toBe("");
    })

  })

  describe('DELETE by ID - API: /api/squads/:id', () => { 

    const toDelDiv = {
      ...initSquad,
      id: "sqd_3397da1adc014cf58c44e07c19914f72",
      event_id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
      squad_name: "Squad 1",
      squad_date: new Date(Date.UTC(2023, 8, 16)),  // month is -1
      squad_time: '01:00 PM',
      games: 6,
      lane_count: 24,
      starting_lane: 1,
      sort_order: 1,
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      try {
        const restoredDiv = {
          ...toDelDiv,
          id: postSecret + 'sqd_3397da1adc014cf58c44e07c19914f72',
        }
        const divJSON = JSON.stringify(restoredDiv);
        const response = await axios({
          method: 'post',
          data: divJSON,
          withCredentials: true,
          url: url
        })
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete a squad', async () => { 
      try {
        const response = await axios({
          method: 'delete',
          withCredentials: true,
          url: url + "/" + toDelDiv.id
        })
        expect(response.status).toBe(200);
        didDel = true;
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(200);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a squad by ID when ID is invalid', async () => {
      try {
        const response = await axios({
          method: 'delete',
          withCredentials: true,
          url: url + "/" + "invalid"
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
    it('should NOT delete a squad by ID when ID is not found', async () => {
      try {
        const response = await axios({
          method: 'delete',
          withCredentials: true,
          url: url + "/" + notFoundId
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
    it('should NOT delete a squad by ID when ID is valid, but not a squad ID', async () => { 
      try {
        const response = await axios({
          method: 'delete',
          withCredentials: true,
          url: url + "/" + nonSquadId
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
    it('should NOT delete a squad by ID when squad has child rows', async () => { 
      try {
        const response = await axios({
          method: 'delete',
          withCredentials: true,
          url: url + "/" + testSquad.id
        })
        expect(response.status).toBe(409);
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