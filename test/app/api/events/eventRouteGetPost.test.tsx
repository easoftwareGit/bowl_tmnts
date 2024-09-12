import axios, { AxiosError } from "axios";
import { baseEventsApi } from "@/lib/db/apiPaths";
import { testBaseEventsApi } from "../../../testApi";
import { eventType } from "@/lib/types/types";
import { initEvent } from "@/lib/db/initVals";
import { Event } from "@prisma/client";
import { postSecret } from "@/lib/tools";
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

const url = testBaseEventsApi.startsWith("undefined")
  ? baseEventsApi
  : testBaseEventsApi;   

describe('Events - GETs and POST API: /api/events', () => { 

  const testEvent: eventType = {
    ...initEvent,
    id: "evt_cb97b73cb538418ab993fc867f860510",
    tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
    event_name: "Singles",
    team_size: 1,
    games: 6,
    added_money: '0',
    entry_fee: '80',
    lineage: '18',
    prize_fund: '55',
    other: '2',
    expenses: '5',
    lpox: '80',
    sort_order: 1,
  };

  const notFoundId = "evt_01234567890123456789012345678901";
  const notfoundParentId = "tmt_01234567890123456789012345678901";
  const nonEventId = "usr_01234567890123456789012345678901";

  const event2Id = 'evt_dadfd0e9c11a4aacb87084f1609a0afd';
  const tmnt1Id = 'tmt_fd99387c33d9c78aba290286576ddce5';

  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const events = response.data.events;
      const toDel = events.find((e: eventType) => e.event_name === 'Test Event');
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

    it('should get all events', async () => {
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 8 rows in prisma/seed.ts
      expect(response.data.events).toHaveLength(8);
    })

  })

  describe('GET event lists API: /api/events/tmnt/:id', () => {
        
    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const events = response.data.events;
      const toDel = events.find((e: eventType) => e.event_name === 'Test Event');
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

    it('should get all events for a tournament', async () => { 
      // const values taken from prisma/seed.ts
      const miltiEventTmntId = 'tmt_fe8ac53dad0f400abe6354210a8f4cd1';
      const tmntEvent1Id = 'evt_9a58f0a486cb4e6c92ca3348702b1a62';
      const tmntEvent2Id = 'evt_cb55703a8a084acb86306e2944320e8d';
      const tmntEvent3Id = 'evt_adfcff4846474a25ad2936aca121bd37';

      const multiEventUrl = url + '/tmnt/' + miltiEventTmntId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiEventUrl, 
      })
      expect(response.status).toBe(200);
      // 3 event rows for tmnt in prisma/seed.ts
      expect(response.data.events).toHaveLength(3);
      const events: Event[] = response.data.events;
      // query in /api/events/tmnt GET sorts by sort_order
      expect(events[0].id).toBe(tmntEvent1Id);
      expect(events[1].id).toBe(tmntEvent2Id);
      expect(events[2].id).toBe(tmntEvent3Id);
    })

  })

  describe('POST', () => { 

    const eventToPost: eventType = {
      ...initEvent,
      id: "",
      tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
      event_name: "Test Event",
      team_size: 1,
      games: 6,
      added_money: '0',
      entry_fee: '80',
      lineage: '18',
      prize_fund: '55',
      other: '2',
      expenses: '5',
      lpox: '80',
      sort_order: 2,
    };

    let createdEventId = '';

    beforeAll(async () => { 
      const response = await axios.get(url);
      const events = response.data.events;
      const toDel = events.find((e: eventType) => e.event_name === 'Test Event');
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
      createdEventId = "";
    })

    afterEach(async () => {
      if (createdEventId) {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + createdEventId,
        });
      }
      createdEventId = "";
    })

    it('should create a new event', async () => { 
      const eventJSON = JSON.stringify(eventToPost);
      const response = await axios({
        method: "post",
        data: eventJSON,
        withCredentials: true,
        url: url,
      });
      expect(response.status).toBe(201);
      const postedEvent = response.data.event;
      createdEventId = postedEvent.id;
      expect(postedEvent.tmnt_id).toEqual(eventToPost.tmnt_id);
      expect(postedEvent.event_name).toEqual(eventToPost.event_name);
      expect(postedEvent.team_size).toEqual(eventToPost.team_size);
      expect(postedEvent.games).toEqual(eventToPost.games);
      expect(postedEvent.entry_fee).toEqual(eventToPost.entry_fee);
      expect(postedEvent.lineage).toEqual(eventToPost.lineage);
      expect(postedEvent.prize_fund).toEqual(eventToPost.prize_fund);
      expect(postedEvent.other).toEqual(eventToPost.other);
      expect(postedEvent.expenses).toEqual(eventToPost.expenses);
      expect(postedEvent.added_money).toEqual(eventToPost.added_money);
      expect(postedEvent.sort_order).toEqual(eventToPost.sort_order);      
      expect(isValidBtDbId(postedEvent.id, 'evt')).toBeTruthy();
    })
    it('should create a new event with the provided eventID', async () => { 
      const supIdEvent = {
        ...eventToPost,
        id: postSecret + notFoundId, // use a valid ID
      }
      const eventJSON = JSON.stringify(supIdEvent);
      const response = await axios({
        method: "post",
        data: eventJSON,
        withCredentials: true,
        url: url,
      });
      expect(response.status).toBe(201);
      const postedEvent = response.data.event;
      createdEventId = postedEvent.id;
      expect(postedEvent.id).toEqual(notFoundId);      
    })
    it('should NOT create a new event when ID is invalid', async () => { 
      try {
        const userJSON = JSON.stringify(eventToPost);
        const response = await axios({
          method: "put",
          data: userJSON,
          withCredentials: true,
          url: url + "/" + 'invalid'
        });
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when ID is valid, but not an event ID', async () => {
      try {
        const userJSON = JSON.stringify(eventToPost);
        const response = await axios({
          method: "put",
          data: userJSON,
          withCredentials: true,
          url: url + "/" + nonEventId
        });
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when tmnt id is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        tmnt_id: "",
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when event name is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        event_name: "",
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when team size is null', async () => { 
      const invalidEvent = {
        ...eventToPost,
        team_size: null as any,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when games is null', async () => { 
      const invalidEvent = {
        ...eventToPost,
        games: null as any,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when added money is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        added_money: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when entry fee is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        entry_fee: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lineage is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        lineage: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when prize fund is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        prize_fund: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when other is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        other: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when expenses is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        expenses: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lpox is blank', async () => { 
      const invalidEvent = {
        ...eventToPost,
        lpox: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when sort order is null', async () => { 
      const invalidEvent = {
        ...eventToPost,
        sort_order: null as any,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when tmnt id is invalid', async () => { 
      const invalidEvent = {
        ...eventToPost,
        tmnt_id: "invalid",
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when tmnt_id is valid, but not a tmnt id', async () => { 
      const invalidEvent = {
        ...eventToPost,
        tmnt_id: nonEventId,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      } 
    })
    it('should NOT create a new event when tmnt_id is valid and a tmnt id, but is not found', async () => {
      const invalidEvent = {
        ...eventToPost,
        tmnt_id: notfoundParentId,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when event name is too long', async () => { 
      const invalidEvent = {
        ...eventToPost,
        event_name: "a".repeat(256),
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when team size is too small', async () => {
      const invalidEvent = {
        ...eventToPost,
        team_size: 0,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when team size is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        team_size: 1000,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when team size is not an integer', async () => {
      const invalidEvent = {
        ...eventToPost,
        team_size: 1.5,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when team size is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        team_size: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when games is too small', async () => {
      const invalidEvent = {
        ...eventToPost,
        games: 0,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when games is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        games: 1000,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when games is not an integer', async () => {
      const invalidEvent = {
        ...eventToPost,
        games: 1.5,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when games is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        games: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when added money is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        added_money: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when added money is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        added_money: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when added money is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        added_money: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when entry fee is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        entry_fee: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when entry fee is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        entry_fee: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when entry fee is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        entry_fee: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lineage is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        lineage: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lineage is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        lineage: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lineage is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        lineage: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when prize_fund is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        prize_fund: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when prize_fund is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        prize_fund: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when prize_fund is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        prize_fund: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when other is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        other: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when other is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        other: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when other is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        other: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when expenses is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        expenses: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when expenses is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        expenses: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when expenses is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        expenses: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lpox is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        lpox: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lpox is negative', async () => {
      const invalidEvent = {
        ...eventToPost,
        lpox: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when lpox is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        lpox: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when sort_order is not a number', async () => {
      const invalidEvent = {
        ...eventToPost,
        sort_order: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when sort_order is too small', async () => {
      const invalidEvent = {
        ...eventToPost,
        sort_order: 0,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when sort_order is too large', async () => {
      const invalidEvent = {
        ...eventToPost,
        sort_order: 1234567,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when entry_fee !== lineage + prize_fund + other + expenses', async () => {
      const invalidEvent = {
        ...eventToPost,
        entry_fee: '100',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when entry_fee !== lpox', async () => {
      const invalidEvent = {
        ...eventToPost,
        lpox: '100',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT create a new event when tmnt_id + event_name are not unique', async () => { 
      // row with tmntId, eventToPost.event_Name already exists
      const dubName = 'Singles';      
      const invalidEvent = {
        ...eventToPost,
        tmnt_id: tmnt1Id,   
        event_name: dubName,
        sort_order: 2,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should create a new event with sanitized event name', async () => {
      const validEvent = {
        ...eventToPost,
        event_name: '<script>' + eventToPost.event_name + '</script>',
      }
      const eventJSON = JSON.stringify(validEvent);
      const response = await axios({
        method: "post",
        data: eventJSON,
        withCredentials: true,
        url: url,
      })
      const postedEvent = response.data.event;
      createdEventId = postedEvent.id;
      expect(response.status).toBe(201);
      expect(postedEvent.tmnt_id).toEqual(eventToPost.tmnt_id);
      expect(postedEvent.event_name).toEqual(eventToPost.event_name);
      expect(postedEvent.team_size).toEqual(eventToPost.team_size);
      expect(postedEvent.games).toEqual(eventToPost.games);
      expect(postedEvent.entry_fee).toEqual(eventToPost.entry_fee);
      expect(postedEvent.lineage).toEqual(eventToPost.lineage);
      expect(postedEvent.prize_fund).toEqual(eventToPost.prize_fund);
      expect(postedEvent.other).toEqual(eventToPost.other);
      expect(postedEvent.expenses).toEqual(eventToPost.expenses);
      expect(postedEvent.added_money).toEqual(eventToPost.added_money);
      expect(postedEvent.sort_order).toEqual(eventToPost.sort_order);
      expect(isValidBtDbId(postedEvent.id, 'evt')).toBeTruthy();
    })  
    
  })

  describe('GET by ID - API: API: /api/events/:id', () => { 

    it('should get an event by ID', async () => { 
      const response = await axios.get(url + '/' + testEvent.id);
      const event = response.data.event;
      expect(event.id).toEqual(testEvent.id);
      expect(event.tmnt_id).toEqual(testEvent.tmnt_id);
      expect(event.event_name).toEqual(testEvent.event_name);
      expect(event.team_size).toEqual(testEvent.team_size);
      expect(event.games).toEqual(testEvent.games);
      expect(event.entry_fee).toEqual(testEvent.entry_fee);
      expect(event.lineage).toEqual(testEvent.lineage);
      expect(event.prize_fund).toEqual(testEvent.prize_fund);
      expect(event.other).toEqual(testEvent.other);
      expect(event.expenses).toEqual(testEvent.expenses);
      expect(event.added_money).toEqual(testEvent.added_money);
      expect(event.sort_order).toEqual(testEvent.sort_order);
    })
    it('should NOT get an event by ID when ID is invalid', async () => {
      try {
        const response = await axios.get(url + '/invalid');
        expect(true).toBeFalsy();
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get an event by ID when ID is valid, but not an event ID', async () => {
      try {
        const response = await axios.get(url + '/' + nonEventId);
        expect(true).toBeFalsy();
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get an event by ID when ID is not found', async () => {
      try {
        const response = await axios.get(url + '/' + notFoundId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        // } else if ('response' in err) {
        //   expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    
  })

})