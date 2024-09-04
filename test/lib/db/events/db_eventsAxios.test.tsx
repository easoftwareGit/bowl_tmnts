import axios, { AxiosError } from "axios";
import { baseEventsApi } from "@/lib/db/apiPaths";
import { testBaseEventsApi } from "../../../testApi";
import { eventType } from "@/lib/types/types";
import { initEvent } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { postEvent } from "@/lib/db/events/eventsAxios";

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
  
describe('eventsAxios', () => { 
  
  describe('postEvent', () => { 

    const eventToPost = {
      ...initEvent,
      id: '',            
      tmnt_id: "tmt_e134ac14c5234d708d26037ae812ac33",
      event_name: "Test Event",
      team_size: 1,
      games: 5,
      added_money: "0",  
      entry_fee: '75',
      lineage: "15",
      prize_fund: "55",
      other: "0",
      expenses: "5",      
      lpox: "75",
      sort_order: 10,
    }

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
  
    it('should post an event', async () => { 

      const postedEvent = await postEvent(eventToPost);
      expect(postedEvent).not.toBeNull();
      if(!postedEvent) return;
      expect(postedEvent).not.toBeNull();
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
    it('should NOT post an event with invalid data', async () => { 
      const invalidEvent = {
        ...eventToPost,
        event_name: '',
      }
      const postedEvent = await postEvent(invalidEvent);
      expect(postedEvent).toBeNull();
    })

  })

})