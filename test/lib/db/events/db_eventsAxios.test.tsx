import axios, { AxiosError } from "axios";
import { baseEventsApi } from "@/lib/db/apiPaths";
import { testBaseEventsApi } from "../../../testApi";
import { eventType } from "@/lib/types/types";
import { initEvent } from "@/lib/db/initVals";
import { isValidBtDbId } from "@/lib/validation";
import { deleteEvent, postEvent, putEvent } from "@/lib/db/events/eventsAxios";
import { postSecret } from "@/lib/tools";

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

describe("eventsAxios", () => {
  describe("postEvent", () => {
    const eventToPost = {
      ...initEvent,
      id: "",
      tmnt_id: "tmt_e134ac14c5234d708d26037ae812ac33",
      event_name: "Test Event",
      team_size: 1,
      games: 5,
      added_money: "0",
      entry_fee: "75",
      lineage: "15",
      prize_fund: "55",
      other: "0",
      expenses: "5",
      lpox: "75",
      sort_order: 10,
    };

    let createdEventId = "";

    beforeAll(async () => {
      const response = await axios.get(url);
      const events = response.data.events;
      const toDel = events.find(
        (e: eventType) => e.event_name === "Test Event"
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
      createdEventId = "";
    });

    afterEach(async () => {
      if (createdEventId) {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + createdEventId,
        });
      }
      createdEventId = "";
    });

    it("should post an event", async () => {
      const postedEvent = await postEvent(eventToPost);
      expect(postedEvent).not.toBeNull();
      if (!postedEvent) return;
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
      expect(isValidBtDbId(postedEvent.id, "evt")).toBeTruthy();
    });
    it("should NOT post an event with invalid data", async () => {
      const invalidEvent = {
        ...eventToPost,
        event_name: "",
      };
      const postedEvent = await postEvent(invalidEvent);
      expect(postedEvent).toBeNull();
    });
  });

  describe("putEvent", () => {
    const toPutEvent = {
      ...initEvent,
      id: "evt_cb97b73cb538418ab993fc867f860510",
      tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
      event_name: "Test Event",
      team_size: 1,
      games: 5,
      added_money: "0",
      entry_fee: "75",
      lineage: "10",
      prize_fund: "60",
      other: "1",
      expenses: "4",
      lpox: "75",
      sort_order: 1,
    };

    const putUrl = url + "/" + toPutEvent.id;

    describe("putEvent - success", () => {
      const resetEvent = {
        ...initEvent,
        id: "evt_cb97b73cb538418ab993fc867f860510",
        tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
        event_name: "Singles",
        team_size: 1,
        games: 6,
        entry_fee: "80",
        lineage: "18",
        prize_fund: "55",
        other: "2",
        expenses: "5",
        added_money: "0",
        lpox: "80",
        sort_order: 1,
      };

      afterEach(async () => {
        const tmntJSON = JSON.stringify(resetEvent);
        const response = await axios({
          method: "put",
          data: tmntJSON,
          withCredentials: true,
          url: putUrl,
        });
      });

      it("should put an event", async () => {
        const puttedEvent = await putEvent(toPutEvent);        
        expect(puttedEvent?.tmnt_id).toEqual(toPutEvent.tmnt_id);
        expect(puttedEvent?.event_name).toEqual(toPutEvent.event_name);
        expect(puttedEvent?.team_size).toEqual(toPutEvent.team_size);
        expect(puttedEvent?.games).toEqual(toPutEvent.games);
        expect(puttedEvent?.entry_fee).toEqual(toPutEvent.entry_fee);
        expect(puttedEvent?.lineage).toEqual(toPutEvent.lineage);
        expect(puttedEvent?.prize_fund).toEqual(toPutEvent.prize_fund);
        expect(puttedEvent?.other).toEqual(toPutEvent.other);
        expect(puttedEvent?.expenses).toEqual(toPutEvent.expenses);
        expect(puttedEvent?.added_money).toEqual(toPutEvent.added_money);
        expect(puttedEvent?.sort_order).toEqual(toPutEvent.sort_order);
      });
    });

    describe("putEvent - failure", () => {
      it("should NOT put an event with invalid data", async () => {
        const invalidEvent = {
          ...toPutEvent,
          event_name: "",
        };
        const puttedEvent = await putEvent(invalidEvent);
        expect(puttedEvent).toBeNull();
      });
    });
  });

  describe("deleteEvent", () => {
    const toDelEvent = {
      ...initEvent,
      id: "evt_bd63777a6aee43be8372e4d008c1d6d0",
      tmnt_id: "tmt_467e51d71659d2e412cbc64a0d19ecb4",
      event_name: "Singles",
      team_size: 1,
      games: 6,
      entry_fee: "80",
      lineage: "18",
      prize_fund: "55",
      other: "2",
      expenses: "5",
      added_money: "0",
      sort_order: 1,
      lpox: "80",
    };

    const delUrl = url + "/" + toDelEvent.id;

    let didDel = false;

    const doRestore = async () => {
      try {
        const restoreEvent = {
          ...toDelEvent,
          id: postSecret + "evt_bd63777a6aee43be8372e4d008c1d6d0",
        };
        const eventJSON = JSON.stringify(restoreEvent);
        const postResponse = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });    
        console.log("postResponse.status: ", postResponse.status);          
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }    
    }

    beforeAll(async () => {     
      let getResponse;
      let notFound = false
      try {
        getResponse = await axios.get(delUrl);
      }
      catch (err) {
        if (err instanceof AxiosError) {
          if (err?.status === 404) {
            notFound = true
          }
        } else {
          expect(true).toBeFalsy();
        }
      }
      // did not find event
      if (notFound || getResponse?.status !== 200 || getResponse?.data === null) {
        await doRestore()
      }
    });

    beforeEach(() => {
      didDel = false;
    });

    afterEach(async () => {
      if (!didDel) return;
      await doRestore();
    });

    it("should delete an event", async () => {
      const deletedEvent = await deleteEvent(toDelEvent);      
      expect(deletedEvent).not.toBeNull();
      expect(deletedEvent?.id).toEqual(toDelEvent.id);      
      didDel = true;
    });

    it("should NOT delete an event when ID is invalid", async () => {
      const invalidEvent = {
        ...toDelEvent,
        id: "123",
      };
      const deletedEvent = await putEvent(invalidEvent);
      expect(deletedEvent).toBeNull();
    });
  });
});
