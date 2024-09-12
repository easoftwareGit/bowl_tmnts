import axios, { AxiosError } from "axios";
import { baseEventsApi } from "@/lib/db/apiPaths";
import { testBaseEventsApi } from "../../../testApi";
import { tmntSaveEvents, exportedForTesting } from "@/app/dataEntry/tmnt/saveTmntEvents";
import { mockEvents, mockEventsToEdit } from "../../../mocks/tmnts/singlesAndDoubles/mockEvents";
import { mockSquadsToEdit } from "../../../mocks/tmnts/singlesAndDoubles/mockSquads";
import { initEvents, initSquad, initEvent } from "@/lib/db/initVals";
import { eventType } from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";
import { mockSquads } from "../../../mocks/tmnts/singlesAndDoubles/mockSquads";
import { deleteEvent, putEvent } from "@/lib/db/events/eventsAxios";
// import { deleteEvent } from "../../../../src/lib/db/events/events";

const { tmntPostEvents, tmntPostPutOrDelEvents } = exportedForTesting;

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

describe('saveTmntEvents', () => {

  describe('save events', () => { 

    const url = testBaseEventsApi.startsWith("undefined")
      ? baseEventsApi
      : testBaseEventsApi;

    describe('tmntSaveEvents - new events', () => { 
      // let createdEvents = false;

      // const delTestEvents = async () => {
      //   try {
      //     const response = await axios.get(url);                    
      //     const events = response.data.events;
      //     const toDels = events.filter(
      //       (e: eventType) => e.sort_order >= 5
      //     );
      //     if (toDels.length > 0) {
      //       for (let i = 0; i < toDels.length; i++) {
      //         const toDel = toDels[i];
      //         try {
      //           const delResponse = await axios({
      //             method: "delete",
      //             withCredentials: true,
      //             url: url + "/" + toDel.id,
      //           });                
      //         } catch (err) {
      //           if (err instanceof AxiosError) console.log(err.message);
      //         }
      //       }
      //     }      
      //   } catch (error) {
      //     if (error instanceof AxiosError) console.log(error.message);
      //   }
      // }

      // beforeAll(async () => {
      //   await delTestEvents();
      // });

      // beforeEach(() => {
      //   createdEvents = false;
      // });

      // afterEach(async () => {
      //   if (createdEvents) {
      //     await delTestEvents();
      //   }
      // });      

      // it('should save new events', async () => {
      //   const toPostEvents = [...mockEvents]
      //   toPostEvents[0].id = "1";  
      //   toPostEvents[0].sort_order = 10;  
      //   toPostEvents[0].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';
      //   toPostEvents[1].id = "2";
      //   toPostEvents[1].sort_order = 11;  
      //   toPostEvents[1].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';

      //   const mockSetEvents = jest.fn();
      //   const mockSetSquads = jest.fn();

      //   const toSaveEvents = {
      //     origEvents: initEvents,
      //     events: toPostEvents,
      //     setEvents: mockSetEvents,
      //     squads: mockSquads,
      //     setSquads: mockSetSquads,
      //   }
      //   const didPost = await tmntSaveEvents(toSaveEvents);
      //   expect(didPost).toBe(true);   
      //   createdEvents = true;
      // })
      // it("should update id's in events and squads", async () => { 
      //   const mockSetEvents = jest.fn();
      //   const mockSetSquads = jest.fn();

      //   const toPostEvents = [...mockEvents]
      //   toPostEvents[0].id = "1";  
      //   toPostEvents[0].sort_order = 10;  
      //   toPostEvents[0].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';
      //   toPostEvents[1].id = "2";
      //   toPostEvents[1].sort_order = 11;  
      //   toPostEvents[1].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';

      //   const toSetSquads = [...mockSquads]
      //   toSetSquads[0].id = "1";
      //   toSetSquads[0].event_id = "1";
      //   toSetSquads[1].id = "2";
      //   toSetSquads[1].event_id = "2";

      //   const toSaveEvents = {
      //     origEvents: initEvents,
      //     events: toPostEvents,
      //     setEvents: mockSetEvents,
      //     squads: mockSquads,
      //     setSquads: mockSetSquads,
      //   }
      //   const didPost = await tmntSaveEvents(toSaveEvents);
      //   expect(didPost).toBe(true);
      //   createdEvents = true;
        
      //   const response = await axios.get(url);                    
      //   const events = response.data.events;
      //   const savedEvents = events.filter(
      //     (e: eventType) => e.sort_order >= 5
      //   );

      //   for (let i = 0; i < savedEvents.length; i++) {
      //     const savedEvent = savedEvents[i];
      //     if (savedEvent.sort_order === 10) {
      //       toPostEvents[0].id = savedEvent.id;
      //     } else if (savedEvent.sort_order === 11) {
      //       toPostEvents[1].id = savedEvent.id;
      //     }
      //   }
      //   expect(mockSetEvents).toHaveBeenCalledTimes(2);        
      //   expect(mockSetEvents).toHaveBeenCalledWith(toPostEvents); 
        
      //   for (let i = 0; i < toSetSquads.length; i++) {
      //     const savedSquad = toSetSquads[i];
      //     if (savedSquad.id === '1') {
      //       savedSquad.event_id = toPostEvents[0].id;
      //     } else if (savedSquad.id === '2') {
      //       savedSquad.event_id = toPostEvents[1].id;
      //     }
      //   }
      //   expect(mockSetSquads).toHaveBeenCalledTimes(2);
      //   expect(mockSetSquads).toHaveBeenCalledWith(toSetSquads);  
      // })
      // it('should call tmntPostEvents when saving new tmnt', async () => {
      //   const mockSetEvents = jest.fn();
      //   const mockSetSquads = jest.fn();

      //   const toPostEvents = [...mockEvents]
      //   toPostEvents[0].id = "1";  
      //   toPostEvents[0].sort_order = 10;  
      //   toPostEvents[0].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';
      //   toPostEvents[1].id = "2";
      //   toPostEvents[1].sort_order = 11;  
      //   toPostEvents[1].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';

      //   const toSetSquads = [...mockSquads]
      //   toSetSquads[0].id = "1";
      //   toSetSquads[0].event_id = "1";
      //   toSetSquads[1].id = "2";
      //   toSetSquads[1].event_id = "2";

      //   const toSaveEvents = {
      //     origEvents: initEvents,
      //     events: toPostEvents,
      //     setEvents: mockSetEvents,
      //     squads: mockSquads,
      //     setSquads: mockSetSquads,
      //   }
      //   const didPost = await tmntPostEvents(toSaveEvents);
      //   expect(didPost).toBe(true);
      //   createdEvents = true;
        
      //   expect(mockSetEvents).toHaveBeenCalledTimes(2);        
      //   expect(mockSetSquads).toHaveBeenCalledTimes(2);
      // })
      // it('should NOT save new events when no parent tournament', async () => {
      //   const toPostEvents = [...mockEvents]
      //   toPostEvents[0].id = "1";  
      //   toPostEvents[0].sort_order = 10;  
      //   toPostEvents[0].tmnt_id = 'tmt_01234567890123456789012345678901';
      //   toPostEvents[1].id = "2";
      //   toPostEvents[1].sort_order = 11;  
      //   toPostEvents[1].tmnt_id = 'tmt_01234567890123456789012345678901';

      //   const mockSetEvents = jest.fn();
      //   const mockSetSquads = jest.fn();

      //   const toSaveEvents = {
      //     origEvents: initEvents,
      //     events: toPostEvents,
      //     setEvents: mockSetEvents,
      //     squads: mockSquads,
      //     setSquads: mockSetSquads,
      //   }
      //   const didPost = await tmntSaveEvents(toSaveEvents);
      //   expect(didPost).toBe(false);   
      //   createdEvents = false;
      // })
      // it('should NOT save new events with invalid event data', async () => { 
      //   const invalidEvents = [...mockEvents]
      //   invalidEvents[0].id = "1";  
      //   invalidEvents[0].sort_order = 10;  
      //   invalidEvents[1].id = "2";
      //   invalidEvents[1].sort_order = 11;  
      //   invalidEvents[1].event_name = '';

      //   const mockSetEvents = jest.fn();
      //   const mockSetSquads = jest.fn();

      //   const toSaveEvents = {
      //     origEvents: initEvents,
      //     events: invalidEvents,
      //     setEvents: mockSetEvents,
      //     squads: mockSquads,
      //     setSquads: mockSetSquads,
      //   }

      //   const didPost = await tmntSaveEvents(toSaveEvents);
      //   expect(didPost).toBe(false);   
      //   createdEvents = false;
      // });
      // it('should NOT save new events with no squads', async () => { 
      //   const invalidEvents = [...mockEvents]
      //   invalidEvents[0].id = "1";  
      //   invalidEvents[0].sort_order = 10;  
      //   invalidEvents[0].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';
      //   invalidEvents[1].id = "2";
      //   invalidEvents[1].sort_order = 11;          
      //   invalidEvents[1].tmnt_id = 'tmt_e134ac14c5234d708d26037ae812ac33';

      //   const mockSetEvents = jest.fn();
      //   const mockSetSquads = jest.fn();

      //   const toSaveEvents = {
      //     origEvents: initEvents,
      //     events: invalidEvents,
      //     setEvents: mockSetEvents,
      //     squads: null as any,
      //     setSquads: mockSetSquads,
      //   }

      //   const didPost = await tmntSaveEvents(toSaveEvents);
      //   expect(didPost).toBe(false);   
      //   createdEvents = false;
      // });
    })

    describe('tmntsSaveEvents - edited Events', () => {
      const mockSetEvents = jest.fn();
      const mockSetSquads = jest.fn();

      describe('tmntsSaveEvents - edited an Event', () => { 
        // const resetEvent = {
        //   ...initEvent,
        //   id: "evt_9a58f0a486cb4e6c92ca3348702b1a62",
        //   tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
        //   event_name: "Singles",
        //   team_size: 1,
        //   games: 6,
        //   entry_fee: '80',
        //   lineage: '18',
        //   prize_fund: '55',
        //   other: '2',
        //   expenses: '5',
        //   added_money: '0',
        //   sort_order: 1,
        //   lpox: '80',
        // }

        // let puttedEvent = false;

        // beforeAll(async () => {
        //   await putEvent(resetEvent);          
        // })

        // beforeEach(() => { puttedEvent = false })

        // afterEach(async () => {
        //   if (puttedEvent) {
        //     await putEvent(resetEvent);            
        //   }
        // })

        // it('should save an edited event', async () => { 
        //   const toPutEvents = mockEventsToEdit.map(a => ({...a}));                    
        //   toPutEvents[0].event_name = "Test Event";  
        //   toPutEvents[0].sort_order = 10;  
  
        //   const toSaveEvents = {
        //     origEvents: mockEventsToEdit,
        //     events: toPutEvents,
        //     setEvents: mockSetEvents,
        //     squads: mockSquadsToEdit,
        //     setSquads: mockSetSquads,
        //   }
  
        //   const didPut = await tmntSaveEvents(toSaveEvents);  
        //   expect(didPut).toBe(true);
        //   puttedEvent = true;
        //   expect(mockSetEvents).not.toHaveBeenCalled();
        //   expect(mockSetSquads).not.toHaveBeenCalled();  
        // })
        // it('should call tmntPostPutOrDelEvents when editing an event', async () => { 
        //   const toPutEvents = mockEventsToEdit.map(a => ({...a}));                    
        //   toPutEvents[0].event_name = "Test Event";  
        //   toPutEvents[0].sort_order = 10;  
  
        //   const toSaveEvents = {
        //     origEvents: mockEventsToEdit,
        //     events: toPutEvents,
        //     setEvents: mockSetEvents,
        //     squads: mockSquadsToEdit,
        //     setSquads: mockSetSquads,
        //   }
  
        //   const didPut = await tmntPostPutOrDelEvents(toSaveEvents);  
        //   expect(didPut).toBe(true);
        //   puttedEvent = true;
        //   expect(mockSetEvents).not.toHaveBeenCalled();
        //   expect(mockSetSquads).not.toHaveBeenCalled();
        // })
      })

      describe('tmntsSaveEvents - added an Event', () => {
        const addedEvent = {
          ...initEvent,
          id: '3',
          tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
          event_name: "Test Event",
          team_size: 3,
          games: 6,
          entry_fee: '240',
          lineage: '54',
          prize_fund: '165',
          other: '6',
          expenses: '15',
          added_money: '0',
          sort_order: 12,
          lpox: '240',
        }

        let postedEvent = false;

        const delAddedEvent = async () => {
          try {
            const response = await axios.get(url);
            const events = response.data.events;
            const toDel = events.find(
              (e: eventType) => e.sort_order === 12
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
          } catch (error) {
            if (error instanceof AxiosError) console.log(error.message);
          }
        }
  
        beforeAll(async () => {
          await delAddedEvent();
        })

        beforeEach(() => { postedEvent = false })

        afterEach(async () => {
          if (postedEvent) {
            await delAddedEvent();
          }
        })

        it('should save an added event', async () => {
          const addedToEvents = mockEventsToEdit.map(a => ({ ...a }));
          addedToEvents.push(addedEvent); 
          
          const toSaveEvents = {
            origEvents: mockEventsToEdit,
            events: addedToEvents,
            setEvents: mockSetEvents,
            squads: mockSquadsToEdit,
            setSquads: mockSetSquads,
          }
  
          const didPost = await tmntSaveEvents(toSaveEvents);
          expect(didPost).toBe(true);
          postedEvent = true;
          expect(mockSetEvents).toHaveBeenCalled();
          expect(mockSetSquads).toHaveBeenCalled();
        })
        // it('should call tmntPostPutOrDelEvents when adding an event whil editing', async () => { 
        //   const addedToEvents = mockEventsToEdit.map(a => ({ ...a }));
        //   addedToEvents.push(addedEvent); 
          
        //   const toSaveEvents = {
        //     origEvents: mockEventsToEdit,
        //     events: addedToEvents,
        //     setEvents: mockSetEvents,
        //     squads: mockSquadsToEdit,
        //     setSquads: mockSetSquads,
        //   }

        //   const didPost = await tmntPostPutOrDelEvents(toSaveEvents);
        //   expect(didPost).toBe(true);
        //   postedEvent = true;
        //   expect(mockSetEvents).toHaveBeenCalled();
        //   expect(mockSetSquads).toHaveBeenCalled();
        // })
      })
    })

  })
    
});
