import axios, { AxiosError } from "axios";
import { baseEventsApi } from "@/db/apiPaths";
import { testBaseEventsApi } from "../../../testApi";
import { eventType } from "@/lib/types/types";
import { initEvent } from "@/db/initVals";
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

describe('Events - PUT, PATCH, DELETE API: /api/events', () => { 

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

  const notfoundId = "evt_01234567890123456789012345678901";
  const notfoundParentId = "tmt_01234567890123456789012345678901";
  const nonEventId = "usr_01234567890123456789012345678901";

  const event2Id = 'evt_dadfd0e9c11a4aacb87084f1609a0afd';

  describe('PUT by ID - API: /api/events/:id', () => { 

    const putEvent = { 
      ...testEvent,
      tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      event_name: "Team",
      team_size: 5,
      games: 3,
      added_money: '0',
      entry_fee: '250',
      lineage: '45',
      prize_fund: '190',
      other: '5',
      expenses: '10',
      lpox: '250',
      sort_order: 4,
    }

    const sampleEvent = {
      ...initEvent, 
      id: '',
      tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      event_name: "All Events",
      team_size: 1,
      games: 1,
      added_money: '0',
      entry_fee: '25',
      lineage: '0',
      prize_fund: '24',
      other: '0',
      expenses: '1',
      lpox: '25',
      sort_order: 5,
    }

    beforeAll(async () => {
      // make sure test user is reset in database
      const userJSON = JSON.stringify(testEvent);
      const putResponse = await axios({
        method: "put",
        data: userJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
    })

    afterEach(async () => {
      try {
        const eventJSON = JSON.stringify(testEvent);
        const putResponse = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update an event by ID', async () => { 
      const eventJSON = JSON.stringify(putEvent);
      const putResponse = await axios({
        method: "put",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const puttedEvent = putResponse.data.event;      
      expect(puttedEvent.tmnt_id).toEqual(putEvent.tmnt_id);
      expect(puttedEvent.event_name).toEqual(putEvent.event_name);
      expect(puttedEvent.team_size).toEqual(putEvent.team_size);
      expect(puttedEvent.games).toEqual(putEvent.games);
      expect(puttedEvent.entry_fee).toEqual(putEvent.entry_fee);
      expect(puttedEvent.lineage).toEqual(putEvent.lineage);
      expect(puttedEvent.prize_fund).toEqual(putEvent.prize_fund);
      expect(puttedEvent.other).toEqual(putEvent.other);
      expect(puttedEvent.expenses).toEqual(putEvent.expenses);
      expect(puttedEvent.added_money).toEqual(putEvent.added_money);
      expect(puttedEvent.sort_order).toEqual(putEvent.sort_order);      
    })
    it('should NOT update an event by ID when ID is invalid', async () => { 
      const eventJSON = JSON.stringify(putEvent);
      try {
        const putResponse = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + 'invalid',
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(404);
          } else {
            expect(true).toBeFalsy();
          }
        }
      }
    })
    it('should NOT update an event by ID when ID is valid, but not an event ID', async () => { 
      const eventJSON = JSON.stringify(putEvent);
      try {
        const putResponse = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + nonEventId,
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(404);
          } else {
            expect(true).toBeFalsy();
          }
        }
      }
    })
    it('should NOT update an event by ID when ID is not found', async () => { 
      const eventJSON = JSON.stringify(putEvent);
      try {
        const putResponse = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + notfoundId,
        })
        expect(putResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(404);
          } else {
            expect(true).toBeFalsy();
          }
        }
      }
    })
    it('should NOT update an event when missing tmnt id', async () => { 
      const invalidEvent = {
        ...putEvent,
        tmnt_id: "",
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing event name', async () => { 
      const invalidEvent = {
        ...putEvent,
        event_name: "",
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing team size', async () => { 
      const invalidEvent = {
        ...putEvent,
        team_size: null as any,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing games', async () => { 
      const invalidEvent = {
        ...putEvent,
        games: null as any,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing added money', async () => { 
      const invalidEvent = {
        ...putEvent,
        added_money: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing entry fee', async () => { 
      const invalidEvent = {
        ...putEvent,
        entry_fee: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing lineage', async () => { 
      const invalidEvent = {
        ...putEvent,
        lineage: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing prize fund', async () => { 
      const invalidEvent = {
        ...putEvent,
        prize_fund: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing other', async () => { 
      const invalidEvent = {
        ...putEvent,
        other: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing expenses', async () => { 
      const invalidEvent = {
        ...putEvent,
        expenses: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing lpox', async () => { 
      const invalidEvent = {
        ...putEvent,
        lpox: '',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when missing sort order', async () => { 
      const invalidEvent = {
        ...putEvent,
        sort_order: null as any,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when tmnt id is invalid', async () => { 
      const invalidEvent = {
        ...putEvent,
        tmnt_id: "invalid",
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when tmnt_id is valid, but not a tmnt id', async () => { 
      const invalidEvent = {
        ...putEvent,
        tmnt_id: nonEventId,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when tmnt_id is valid and a tmnt_id, but not found', async () => {
      const invalidEvent = {
        ...putEvent,
        tmnt_id: notfoundParentId,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when event name is too long', async () => { 
      const invalidEvent = {
        ...putEvent,
        event_name: "a".repeat(256),
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when team size is too small', async () => { 
      const invalidEvent = {
        ...putEvent,
        team_size: 0,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when team size is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        team_size: 1000,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when team size is not an integer', async () => { 
      const invalidEvent = {
        ...putEvent,
        team_size: 1.5,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when games is too small', async () => { 
      const invalidEvent = {
        ...putEvent,
        games: 0,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when games is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        games: 1000,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when games is not an integer', async () => { 
      const invalidEvent = {
        ...putEvent,
        games: 1.5,
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when added money is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        added_money: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when added money is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        added_money: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when added money is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        added_money: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when entry fee is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        entry_fee: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when entry fee is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        entry_fee: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when entry fee is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        entry_fee: '1234567',
      } 
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when lineage is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        lineage: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when lineage is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        lineage: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when lineage is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        lineage: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when prize_fund is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        prize_fund: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when prize_fund is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        prize_fund: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when prize_fund is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        prize_fund: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when other is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        other: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when other is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        other: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when other is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        other: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when expenses is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        expenses: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when expenses is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        expenses: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when expenses is too large', async () => { 
      const invalidEvent = {
        ...putEvent,
        expenses: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when lpox is not a number', async () => { 
      const invalidEvent = {
        ...putEvent,
        lpox: 'abc',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when lpox is negative', async () => { 
      const invalidEvent = {
        ...putEvent,
        lpox: '-1',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when lpox is too large', async () => { 
      const invalidEvent = { 
        ...putEvent,
        lpox: '1234567',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when entry_fee !== lineage + prize_fund + other + expenses', async () => {
      const invalidEvent = {
        ...putEvent,
        entry_fee: '100',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT update an event when entry_fee !== lpox', async () => {
      const invalidEvent = {  
        ...putEvent,
        lpox: '100',
      }
      const eventJSON = JSON.stringify(invalidEvent);
      try {
        const response = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should create a new event with sanitized event name', async () => {
      const validEvent = {
        ...putEvent,
        event_name: '<script>' + sampleEvent.event_name + '</script>',
      }
      const eventJSON = JSON.stringify(validEvent);
      const response = await axios({
        method: "put",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const puttedEvent = response.data.event;      
      expect(response.status).toBe(200);      
      expect(puttedEvent.event_name).toEqual(sampleEvent.event_name);
    })      
  })

  describe('PATCH by ID - API: /api/events/:id', () => {

    beforeAll(async () => {
      // make sure test user is reset in database
      const userJSON = JSON.stringify(testEvent);
      const putResponse = await axios({
        method: "put",
        data: userJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
    })

    afterEach(async () => {
      try {
        const eventJSON = JSON.stringify(testEvent);
        const putResponse = await axios({
          method: "put",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch tmnt_id in an event by ID', async () => {
      // last tmnt is seeds, also used for delete test 
      const tmntNoEventsId = 'tmt_e134ac14c5234d708d26037ae812ac33';
      const patchEvent = {
        ...testEvent,
        tmnt_id: tmntNoEventsId,
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.tmnt_id).toEqual(patchEvent.tmnt_id);
    })
    it('should patch event_name in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        event_name: 'Updated Event Name',
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.event_name).toEqual(patchEvent.event_name);
    })
    it('should patch team_size in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        team_size: 2,
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.team_size).toEqual(patchEvent.team_size);
    })
    it('should patch games in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        games: 4,
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.games).toEqual(patchEvent.games);
    })
    it('should patch added_money in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        added_money: '10',
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.added_money).toEqual(patchEvent.added_money);
    })
    it('should patch entry fee, lineage and lpox in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        entry_fee: '81',
        lineage: '19',
        lpox: '81',
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.entry_fee).toEqual(patchEvent.entry_fee);
      expect(patchedEvent.lineage).toEqual(patchEvent.lineage);
      expect(patchedEvent.lpox).toEqual(patchEvent.lpox);
    })
    it('should patch entry fee, prize fund, lpox in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        entry_fee: '81',
        prize_fund: '56',
        lpox: '81',
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.entry_fee).toEqual(patchEvent.entry_fee);
      expect(patchedEvent.prize_fund).toEqual(patchEvent.prize_fund);
      expect(patchedEvent.lpox).toEqual(patchEvent.lpox);
    })
    it('should patch entry fee, other, lpox in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        entry_fee: '81',
        other: '3',
        lpox: '81',
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.entry_fee).toEqual(patchEvent.entry_fee);
      expect(patchedEvent.other).toEqual(patchEvent.other);
      expect(patchedEvent.lpox).toEqual(patchEvent.lpox);
    })
    it('should patch entry fee, expenses, lpox in an event by ID', async () => {
      const patchEvent = {
        ...testEvent,
        entry_fee: '81',
        expenses: '6',
        lpox: '81',
      }
      const eventJSON = JSON.stringify(patchEvent);
      const response = await axios({
        method: "patch",
        data: eventJSON,
        withCredentials: true,
        url: url + "/" + testEvent.id,
      })
      const patchedEvent = response.data.event;
      expect(response.status).toBe(200);
      expect(patchedEvent.entry_fee).toEqual(patchEvent.entry_fee);
      expect(patchedEvent.expenses).toEqual(patchEvent.expenses);
      expect(patchedEvent.lpox).toEqual(patchEvent.lpox);
    })
    it('should NOT patch invalid tmnt_id in an event by ID', async () => {
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          tmnt_id: 'invalid',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT patch tmnt_id when tmnt_id is valid, but not a tmnt id by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          tmnt_id: nonEventId, 
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should NOT patch tmnt_id when tmnt_id is valid and a tmnt_id, but not found by ID', async () => {
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          tmnt_id: notfoundParentId, 
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch event name when event name is missing in an event by ID', async () => {
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          event_name: "",
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch event name when event name is too long in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          event_name: "a".repeat(256),
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch team size when team size is too low in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          team_size: 0,
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch team size when team size is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          team_size: 1001,
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch games when games is too low in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          games: 0,
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch games when games is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          games: 1001,
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch added money when added money is negitive in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          added_money: '-1',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch added money when added money is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          added_money: '1234567',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch entry fee when entry fee is negitive in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          entry_fee: '-1',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch entry fee when entry fee is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          entry_fee: '1234567',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch lineage when lineage is negitive in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          lineage: '-1',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch lineage when lineage is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          lineage: '1234567',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch prize fund when prize fund is negitive in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          prize_fund: '-1',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch prize fund when prize fund is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          prize_fund: '1234567',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch other when other is negitive in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          other: '-1',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch other when other is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          other: '1234567',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch expenses when expenses is negitive in an event by ID', async () => {
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          expenses: '-1',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch expenses when expenses is too high in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          expenses: '1234567',
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch when entry fee !== lpox in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          lpox: '81',          
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
    it('should not patch when entry fee !== (lineage + prize fund + other + expenses) in an event by ID', async () => { 
      try {
        const eventJSON = JSON.stringify({
          ...testEvent,
          entry_fee: '81',          
        })
        const response = await axios({
          method: "patch",
          data: eventJSON,
          withCredentials: true,
          url: url + "/" + testEvent.id,
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
  })

  describe('DELETE by ID - API: /api/events/:id', () => {

    const toDelEvent = {
      ...initEvent,
      id: "evt_bd63777a6aee43be8372e4d008c1d6d0",
      tmnt_id: "tmt_467e51d71659d2e412cbc64a0d19ecb4",
      event_name: "Singles",
      team_size: 1,
      games: 6,
      entry_fee: '80',
      lineage: '18',
      prize_fund: '55',
      other: '2',
      expenses: '5',
      added_money: '0',
      sort_order: 1,
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      // if deleted bowl, add bowl back
      try {
        const restoreUser = {
          ...toDelEvent,
          id: postSecret + "evt_bd63777a6aee43be8372e4d008c1d6d0",
        }
        const bowlJSON = JSON.stringify(restoreUser);
        const response = await axios({
          method: "post",
          data: bowlJSON,
          withCredentials: true,
          url: url,
        });  
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete an event by ID', async () => {
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelEvent.id,
        });
        expect(response.status).toBe(200);
        didDel = true;
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete an event by ID when ID is invalid', async () => { 
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + 'invalid',
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
    it('should NOT delete an event by ID when ID is valid, but not an event ID', async () => { 
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonEventId,
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
    it('should NOT delete an event by ID when ID is valid, but not found', async () => { 
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + notfoundId,
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
    it('should NOT delete an event by ID when event has child rows', async () => { 
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + testEvent.id
        });
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