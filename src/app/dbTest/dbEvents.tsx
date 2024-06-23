import React, { useEffect } from "react";
import axios from "axios";
import { baseApi, nextPostSecret } from "@/lib/tools";
import { eventType } from "@/lib/types/types";
import { initEvent } from "@/db/initVals";
import exp from "constants";

const url = baseApi + "/events";
const eventId = "evt_cb97b73cb538418ab993fc867f860510";
const eventIdUrl = url + "/" + eventId;
const multiEventsTmntId = 'tmt_fe8ac53dad0f400abe6354210a8f4cd1' 
const noEventsTmntId = 'tmt_718fe20f53dd4e539692c6c64f991bbe'
let passed = true;
let allResults = '';

export const DbEvents = () => {
  const [eventCrud, setEventCrud] = React.useState("create");
  const [results, setResults] = React.useState("");  

  useEffect(() => {
    setResults(results);
    // force textarea to scroll to bottom
    var textarea = document.getElementById('eventResults');
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [results]);

  const eventToPost: eventType = {
    ...initEvent,
    id: '',
    tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
    event_name: "Test Event",
    team_size: 1,
    games: 6,
    added_money: '0',
    entry_fee: '125',
    lineage: '24',
    prize_fund: '95',
    other: '2',
    expenses: '4',
    lpox: '125',
    sort_order: 2,    
  }
  
  const eventToUpdate: eventType = {
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
  }

  const eventUpdatedTo: eventType = {
    ...initEvent,
    id: "evt_cb97b73cb538418ab993fc867f860510",
    tmnt_id: "tmt_56d916ece6b50e6293300248c6792316",
    event_name: "Event Test",
    team_size: 2,
    games: 6,
    added_money: '100',
    entry_fee: '180',
    lineage: '36',
    prize_fund: '134',
    other: '4',
    expenses: '6',
    lpox: '180',
    sort_order: 4,
  }

  const eventDuplicate: eventType = {
    ...initEvent,
    id: "evt_06055deb80674bd592a357a4716d8ef2",
    tmnt_id: "tmt_d9b1af944d4941f65b2d2d4ac160cdea",
    event_name: "Singles",
    team_size: 1,
    games: 6,
    entry_fee: '60',
    lineage: '15',
    prize_fund: '45',
    other: '0',
    expenses: '0',
    added_money: '0',
    lpox: '60',
    sort_order: 1,
  }    

  const eventToDel: eventType = {
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
    lpox: '80',
    sort_order: 1,
  }

  const addToResults = (newText: string, pass: boolean = true): string => { 
    if (pass) {
      newText = '🟢' + newText;
    } else {
      newText = '🔴' + newText; 
      passed = false;
    }
    allResults += newText + '\n'
    return newText + '\n'    
  }

  const removeCreatedEvent = async (showResults: boolean) => {
    let testResults = results;
    try {
      const allEvents: eventType[] = await eventReadAll(false) as unknown as eventType[]
      const justPostedEvent = allEvents.filter(event => event.event_name === eventToPost.event_name);
      if (justPostedEvent.length === 1) {
        await eventDelete(justPostedEvent[0].id, false)
        if (showResults) {
          testResults += addToResults(`Reset Created Event: ${justPostedEvent[0].event_name}`);
        }        
      }      
      return allEvents
    } catch (error: any) {
      testResults += addToResults(`Remove Created Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };      
    }
  }

  const resetEventToUpdate = async (showResults: boolean) => {
    let testResults = results;
    try {
      const response = await axios({
        method: "put",
        data: eventToUpdate,
        withCredentials: true,
        url: eventIdUrl,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Reset Event: ${eventToUpdate.event_name}`);          
        }
        return response.data;
      } else {
        testResults += addToResults(`Error resetting: status: ${response.status}`, false);        
        return {
          error: 'Error re-setting',
          status: response.status,
        };  
      }
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      setResults(testResults)
    }
  }

  const reAddDeletedEvent = async () => {
    let testResults = results;    
    try {
      let response
      try {
        const delEventUrl = url +'/' + eventToDel.id
        response = await axios({
          method: "get",
          withCredentials: true,
          url: delEventUrl,
        });
        // if event already exisits, do not delete it
        if (response.status === 200) {       
          return {
            data: eventToDel,
            status: 201
          }
        } else {
          return {
            error: 'Error re-adding',
            status: response.status
          }
        }             
      } catch (error: any) {
        // should get a 404 error if Event does not exist, ok to continue
        // non 404 return is bad
        if (error.response.status !== 404) {
          return {
            error: error.message,
            status: error.response.status
          }
        }
      }
      const reAddEvent = {
        ...eventToDel,
      }
      reAddEvent.id = nextPostSecret + reAddEvent.id;
      const eventJSON = JSON.stringify(reAddEvent);
      response = await axios({
        method: "post",
        data: eventJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        return {
          data: eventToDel,
          status: 201
        }
      } else {
        return {
          error: 'Error re-adding',
          status: response.status
        }
      }
    } catch (error: any) {
      testResults += addToResults(`ReAdd Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    }
  }

  const eventCreate = async () => {
    let testResults: string = results + 'Create Event tests: \n';       
    let createdEventId: string = '';
    passed = true;
        
    const deleteCreated = async () => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url,
        });
        if (response.status === 200) {
          const all: eventType[] = response.data.events as unknown as eventType[]
          const justCreated = all.filter(event => event.event_name === eventToPost.event_name);
          if (justCreated.length === 1) {
            await eventDelete(justCreated[0].id, false)
          }
        }
      } catch (error: any) {
        testResults += addToResults('Error deleteing created event', false)
        return {
          error: error.message,
          status: 404,
        };
      }
    }

    const eventInvalidCreate = async (propertyName: string, value: any) => { 
      try {        
        const invalidEventJSON = JSON.stringify({
          ...eventToUpdate,
          [propertyName]: value,
        })
        const invalidResponse = await axios({
          method: "post",
          data: invalidEventJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(`Create Event Error: did not return 422 for invalid ${propertyName}`, false)                    
          return {
            error: `Error creating event with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(`Create Event, non 422 response for event: ${eventToUpdate.event_name} - invalid data`)
          return {
            error: 'Error Creating Event, non 422 response for invalid data',
            status: invalidResponse.status,
          };
        }
      } catch (error: any) { 
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Create event: ${eventToUpdate.event_name} - invalid ${propertyName}`)
          return {
            error: '',
            status: error.response.status,
          }
        } else {
          testResults += addToResults(`Create Error: did not return 422 for invalid ${propertyName}`, false)                  
          return {
            error: `Error Creating event with invalid ${propertyName}`,
            status: error.response.status,
          };          
        }
      }
    } 

    const eventCreateDuplicate = async () => {
      try {
        const duplicate = {
          ...eventDuplicate,
          id: ''
        }
        const eventJSON = JSON.stringify(duplicate);
        const invalidResponse = await axios({
          method: "post",
          data: eventJSON,
          withCredentials: true,
          url: url,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(`Create Event Error: did not return 422 for duplicate tmnt_id+event_name`, false)          
          return {
            error: `Error creating event with duplicate tmnt_id+event_name`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(`Create Event, non 422 response for duplicate tmnt_id+event_name`)
          return {
            error: 'Error Creating Event, non 422 response for duplicate tmnt_id+event_name',
            status: invalidResponse.status,
          };
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Create event: duplicate tmnt_id+event_name`)
          return {
            error: '',
            status: error.response.status,
          }
        } else {
          testResults += addToResults(`Create Error: did not return 422 for duplicate tmnt_id+event_name`, false)                  
          return {
            error: `Error Creating event with duplicate tmnt_id+event_name`,
            status: error.response.status,
          };          
        }
      }
    }

    try {           
      await deleteCreated();

      const eventJSON = JSON.stringify(eventToPost);
      const response = await axios({
        method: "post",
        data: eventJSON,
        withCredentials: true,
        url: url,
      });
      if (response.status === 201) {
        createdEventId = response.data.event.id;
        testResults += addToResults(`Created event: ${response.data.event.event_name}`)
        const postedEvent: eventType = response.data.event;
        if (postedEvent.tmnt_id !== eventToPost.tmnt_id) {
          testResults += addToResults('Created event tmnt_id !== eventToPost.tmnt_id', false)
        } else if (postedEvent.event_name !== eventToPost.event_name) {
          testResults += addToResults('Created event event_name !== eventToPost.event_name', false)        
        } else if (postedEvent.team_size !== eventToPost.team_size) {
          testResults += addToResults('Created event team_size !== eventToPost.team_size', false)          
        } else if (postedEvent.games !== eventToPost.games) {
          testResults += addToResults('Created event games !== eventToPost.games', false)
        } else if (postedEvent.added_money !== eventToPost.added_money) {
          testResults += addToResults('Created event added_money !== eventToPost.added_money', false)
        } else if (postedEvent.entry_fee !== eventToPost.entry_fee) {
          testResults += addToResults('Created event entry_fee !== eventToPost.entry_fee', false)
        } else if (postedEvent.lineage !== eventToPost.lineage) {
          testResults += addToResults('Created event lineage !== eventToPost.lineage', false)
        } else if (postedEvent.prize_fund !== eventToPost.prize_fund) {
          testResults += addToResults('Created event prize_fund !== eventToPost.prize_fund', false)
        } else if (postedEvent.other !== eventToPost.other) {
          testResults += addToResults('Created event other !== eventToPost.other', false)
        } else if (postedEvent.expenses !== eventToPost.expenses) {
          testResults += addToResults('Created event expenses !== eventToPost.expenses', false)
        } else if (postedEvent.sort_order !== eventToPost.sort_order) {
          testResults += addToResults('Created event sort_order !== eventToPost.sort_order', false)        
        } else {
          testResults += addToResults(`Created event === eventToPost`)
        }        
      } else {
        testResults += addToResults(`Error creating event: ${eventToPost.event_name}, response status: ${response.status}`, false);                
        return {
          error: 'Did not create event',
          status: response.status,
        };  
      }

      await eventInvalidCreate('tmnt_id', 'bwl_123');
      await eventInvalidCreate('event_name', '');
      await eventInvalidCreate('team_size', 1234567890);
      await eventInvalidCreate('games', 0);      
      await eventInvalidCreate('added_money', 'abc');
      await eventInvalidCreate('entry_fee', '-1');
      await eventInvalidCreate('lineage', 'abc');
      await eventInvalidCreate('prize_fund', '1234567890');
      await eventInvalidCreate('other', '-1');
      await eventInvalidCreate('expenses', '1234567890');      
      await eventInvalidCreate('sort_order', 'abc');
      await eventInvalidCreate('lpox', '123');      // entry_fee !== lpox
      await eventInvalidCreate('entry_fee', '123'); // entry_fee !== lpox
      await eventInvalidCreate('lineage', '123');    // entry_fee !== lpox

      await eventCreateDuplicate();
              
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Create Error: ${error.message}`, false)            
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (createdEventId) {
        await eventDelete(createdEventId, false)
      }
      if (passed) {
        testResults += addToResults(`Create Event tests: PASSED`, true);
      } else {
        testResults += addToResults(`Create Event tests: FAILED`, false);
      }
      setResults(testResults) 
    }
  };

  const eventReadAll = async (showResults: boolean) => {    
    let testResults = results + 'Read All Events tests: \n';
    passed = true;
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: url,
      });
      if (response.status === 200) {
        if (showResults) {
          testResults += addToResults(`Success: Read ${response.data.events.length} Events`, true);                  
        }
        const allEvents: eventType[] = response.data.events as unknown as eventType[]

        // 78 events in /prisma/seeds.ts
        const seedEvents = 8
        if (allEvents.length === seedEvents) {
          testResults += addToResults(`Read all ${seedEvents} events`, true);
        } else {
          testResults += addToResults(`Error: Read ${allEvents.length} events, expected ${seedEvents}`, false);
        }          
        
        return response.data.events;
      } else {
        testResults += addToResults(`Error reading all events, response status: ${response.status}`, false);                
        return {
          error: 'Did not read all events',
          status: response.status,
        };  
      }      
    } catch (error: any) {
      testResults += addToResults(`Read All Error: ${error.message}`, false);
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (showResults) {
        if (passed) {
          testResults += addToResults(`Read All Events tests: PASSED`, true);
        } else {
          testResults += addToResults(`Read All Events tests: FAILED`, false);
        }
        setResults(testResults)              
      }
    }
  };

  const eventRead1 = async () => {
    let testResults = results + 'Read 1 Event tests: \n';
    passed = true;

    const readInvalidId = async (id: string) => {
      try {
        const invalidUrl = url + "/" + id;
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: invalidUrl,
        });  
        if (invalidResponse.status !== 404) {
          testResults += addToResults(`Read 1 Event Error: did not return 404 for invalid id ${id}`, false)                  
          return {
            error: `Error getting with invalid id: ${id}`,
            status: invalidResponse.status,
          };          
        } else {
          testResults += addToResults(`Read 1 Event, non 404 response for invalid id: ${id}`)
          return {
            error: `Error Reading 1 Event, non 404 response for invalid id: ${id}`,
            status: invalidResponse.status,
          };          
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read 1 Event: invalid id: ${id}`)          
          return {
            error: `invalid id: ${id}`,
            status: 404,
          };          
        } else {
          testResults += addToResults(`Read 1 Event Error: did not return 404 for invalid id: ${id}`, false)                  
          return {
            error: `Error Reading 1 Event, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };          
        }        
      }      
    }
    
    const testEvent: eventType = {
      ...eventToUpdate,
    }
    try {
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: eventIdUrl,
      });
      if (response.status === 200) {        
        testResults += addToResults(`Success: Read 1 Event: ${response.data.event.event_name}`, true);        
        const readEvent: eventType = response.data.event;
        if (readEvent.tmnt_id !== testEvent.tmnt_id) {
          testResults += addToResults('Read 1 Event tmnt_id !== testEvent.tmnt_id', false)
        } else if (readEvent.event_name !== testEvent.event_name) {
          testResults += addToResults('Read 1 Event event_name !== testEvent.event_name', false)
        } else if (readEvent.team_size !== testEvent.team_size) {
          testResults += addToResults('Read 1 Event team_size !== testEvent.team_size', false)
        } else if (readEvent.games !== testEvent.games) {
          testResults += addToResults('Read 1 Event games !== testEvent.games', false)
        } else if (readEvent.added_money !== testEvent.added_money) {
          testResults += addToResults('Read 1 Event added_money !== testEvent.added_money', false)
        } else if (readEvent.entry_fee !== testEvent.entry_fee) {
          testResults += addToResults('Read 1 Event entry_fee !== testEvent.entry_fee', false)
        } else if (readEvent.lineage !== testEvent.lineage) {
          testResults += addToResults('Read 1 Event lineage !== testEvent.lineage', false)
        } else if (readEvent.prize_fund !== testEvent.prize_fund) {
          testResults += addToResults('Read 1 Event prize_fund !== testEvent.prize_fund', false)
        } else if (readEvent.other !== testEvent.other) {
          testResults += addToResults('Read 1 Event other !== testEvent.other', false)
        } else if (readEvent.expenses !== testEvent.expenses) {
          testResults += addToResults('Read 1 Event expenses !== testEvent.expenses', false)
        } else if (readEvent.sort_order !== testEvent.sort_order) {
          testResults += addToResults('Read 1 Event sort_order !== testEvent.sort_order', false)        
        } else {
          testResults += addToResults(`Read 1 Event === testEvent`)
        }        
      } else {
        testResults += addToResults(`Error reading 1 event, response status: ${response.status}`, false);                
        return {
          error: 'Did not read 1 event',
          status: response.status,
        };
      }

      // test invalid url
      await readInvalidId('abc_123')
      // test non existing event
      await readInvalidId('evt_12345678901234567890123456789012')
                            
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Read 1 Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      if (passed) {
        testResults += addToResults(`Read 1 Event tests: PASSED`, true);
      } else {
        testResults += addToResults(`Read 1 Event tests: FAILED`, false);
      }
      setResults(testResults)
    }
  };

  const eventReadForTmnt = async () => {
    let testResults = results + 'Read Events for a Tmnt tests: \n';
    passed = true;

    const validReadForTmnt = async (tmntId: string) => {
      try {
        const response = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/tmnt/" + tmntId,
        });
        if (response.status === 200) {
          testResults += addToResults(`Success: Read Events for Tmnt, tmnt_id: ${tmntId}`);
          const readEvents: eventType[] = response.data.events;
          if (tmntId === multiEventsTmntId) {
            if (readEvents.length !== 2) {
              testResults += addToResults('Error: Read Events for Tmnt length !== 2', false)              
              return {
                error: 'Error: Read Events for Tmnt, length !== 2',
                status: 404,
              }
            }
            readEvents.forEach((event: eventType) => {
              if (!(event.id === 'evt_9a58f0a486cb4e6c92ca3348702b1a62'
                || event.id === 'evt_cb55703a8a084acb86306e2944320e8d')) {
                testResults += addToResults('Error: Read Events for Tmnt event.id invalid', false)                
                return {
                  error: 'Error: Read Events for Tmnt, event.id invalid',
                  status: 404,
                }
              }
            })
          } else if (tmntId === noEventsTmntId) {
            if (readEvents.length !== 0) {
              testResults += addToResults('Error: Read Events for Tmnt length !== 0', false)              
              return {
                error: 'Error: Read Events for Tmnt, length !== 0',
                status: 404,
              }
            }
          }
          testResults += addToResults(`Success: Read Events for Tmnt, ${readEvents.length} rows returned`)
        } else {
          testResults += addToResults(`Error reading events for tmnt, response status: ${response.status}`, false);          
          return {
            error: 'Did not read events for tmnt',
            status: response.status,
          };
        }
        return response.data.events;
      } catch (error: any) {
        testResults += addToResults(`Read Events for Tmnt Error: ${error.message}`, false);        
        return {
          error: error.message,
          status: 404,
        };
      }
    }

    const invalidReadForTmnt = async (tmntId: string) => {
      try {
        const invalidResponse = await axios({
          method: "get",
          withCredentials: true,
          url: url + "/tmnt/" + tmntId,
        });
        if (invalidResponse.status !== 404) {
          testResults += addToResults(`Read Events for Tmnt Error: did not return 404 for invalid id ${tmntId}`, false)                  
          return {
            error: `Error getting with invalid id: ${tmntId}`,
            status: invalidResponse.status,
          };          
        } else {
          testResults += addToResults(`Read Events for Tmnt, non 404 response for invalid id: ${tmntId}`)
          return {
            error: `Error Reading Events for Tmnt, non 404 response for invalid id: ${tmntId}`,
            status: invalidResponse.status,
          };          
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT Read Events for Tmnt: invalid id: ${tmntId}`)          
          return {
            error: `invalid id: ${tmntId}`,
            status: 404,
          };          
        } else {
          testResults += addToResults(`Read Events for Tmnt Error: did not return 404 for invalid id: ${tmntId}`, false)                  
          return {
            error: `Error Reading Events for Tmnt, non 404 response for invalid id: ${tmntId}`,
            status: error.response.status,
          };          
        }            
      }
    }

    try {
      await validReadForTmnt(multiEventsTmntId)
      await validReadForTmnt(noEventsTmntId)

      await invalidReadForTmnt('tmt_123')
      await invalidReadForTmnt('usr_cb97b73cb538418ab993fc867f860510')
      return {
        events: [],
        status: 200,
      };      
    } catch (error: any) {
      return {
        error: error.message,
        status: 404,
      }
    } finally {
      if (passed) {
        testResults += addToResults(`Read Events for a Tmnt tests: PASSED`)
      } else {
        testResults += addToResults(`Read Events for a Tmnt tests: FAILED`, false)
      }
      setResults(testResults)
    }
  };

  const eventUpdate = async () => {
    let testResults = results + 'Update Event tests: \n';
    passed = true;
   
    const updateValid = async () => {
      try {
        const validJSON = JSON.stringify(eventUpdatedTo);
        const response = await axios({
          method: "put",
          data: validJSON,
          withCredentials: true,
          url: eventIdUrl,
        });
        if (response.status !== 200) {
          const errMsg = (response as any).message
          testResults += addToResults(`Error: ${errMsg.message}`, false);          
          return response;
        }
        const updatedEvent: eventType = response.data.event;
        if (updatedEvent.tmnt_id !== eventUpdatedTo.tmnt_id) {
          testResults += addToResults('Updated event tmnt_id !== eventUpdatedTo.tmnt_id', false)
        } else if (updatedEvent.event_name !== eventUpdatedTo.event_name) {
          testResults += addToResults('Updated event event_name !== eventUpdatedTo.event_name', false)
        } else if (updatedEvent.team_size !== eventUpdatedTo.team_size) {
          testResults += addToResults('Updated event team_size !== eventUpdatedTo.team_size', false)
        } else if (updatedEvent.games !== eventUpdatedTo.games) {
          testResults += addToResults('Updated event games !== eventUpdatedTo.games', false)
        } else if (updatedEvent.added_money !== eventUpdatedTo.added_money) {
          testResults += addToResults('Updated event added_money !== eventUpdatedTo.added_money', false)
        } else if (updatedEvent.entry_fee !== eventUpdatedTo.entry_fee) {
          testResults += addToResults('Updated event entry_fee !== eventUpdatedTo.entry_fee', false)
        } else if (updatedEvent.lineage !== eventUpdatedTo.lineage) {
          testResults += addToResults('Updated event lineage !== eventUpdatedTo.lineage', false)      
        } else if (updatedEvent.prize_fund !== eventUpdatedTo.prize_fund) {
          testResults += addToResults('Updated event prize_fund !== eventUpdatedTo.prize_fund', false)
        } else if (updatedEvent.other !== eventUpdatedTo.other) {
          testResults += addToResults('Updated event other !== eventUpdatedTo.other', false)
        } else if (updatedEvent.lpox !== eventUpdatedTo.lpox) {
          testResults += addToResults('Updated event lpox !== eventUpdatedTo.lpox', false)  
        } else if (updatedEvent.sort_order !== eventUpdatedTo.sort_order) {
          testResults += addToResults('Updated event sort_order !== eventUpdatedTo.sort_order', false)  
        } else {
          testResults += addToResults(`Updated Event: ${updatedEvent.event_name}`);
        }                
        return response;
      } catch (error: any) {
        testResults += addToResults(`Error: ${error.message}`, false);        
        return error;
      }
    };

    const invalidUpdate = async (propertyName: string, value: any) => { 
      try {        
        const invalidJSON = JSON.stringify({
          ...eventToUpdate,
          [propertyName]: value,
        })
        const invalidResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: eventIdUrl,
        });
        if (invalidResponse.status !== 422) {
          testResults += addToResults(`Update Event Error: did not return 422 for invalid ${propertyName}`, false)          
          return {
            error: `Error updating event with invalid ${propertyName}`,
            status: invalidResponse.status,
          };
        } else {
          testResults += addToResults(`Update Event, non 422 response for event: ${eventToUpdate.event_name} - invalid data`)
          return {
            error: 'Error Updating Event, non 422 response for invalid data',
            status: invalidResponse.status,
          };
        }
      } catch (error: any) { 
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Update event: ${eventToUpdate.event_name} - invalid ${propertyName}`)
          return {
            error: '',
            status: error.response.status,
          }
        } else {
          testResults += addToResults(`Update Error: did not return 422 for invalid ${propertyName}`, false)                  
          return {
            error: `Error Updating event with invalid ${propertyName}`,
            status: error.response.status,
          };          
        }
      }
    } 

    const dontUpdateInvalidId = async (id: string) => {      
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(eventUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "put",
          data: invalidJSON,
          withCredentials: true,
          url: invalidUrl,
        });        

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: updated invalid id: ${id}`);          
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT update Event, invalid id: ${id}`);
        }
        return notUpdatedResponse;        
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT update Event, invalid id: ${id}`);          
        } else {
          testResults += addToResults(`Update Event Error: did not return 404 for invalid id: ${id}`, false)                  
          return {
            error: `Error Updating Event, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };          
        }                
      }
    };

    const dontUpdateDuplicate = async () => {
      // get url with id of event to duplicate                                     
      const duplicatIdUrl = url + '/' + "evt_dadfd0e9c11a4aacb87084f1609a0afd";
      try {
        const dupJSON = JSON.stringify(eventDuplicate);
        const response = await axios({
          method: "put",
          data: dupJSON,
          withCredentials: true,
          url: duplicatIdUrl,
        });
        if (response.status === 200) {
          testResults += addToResults(`Error: updated duplicate tmnt_id+event_name`, false);          
          return response;
        } else {
          testResults += addToResults(`DID NOT update Event, duplicate tmnt_id+event_name`, false);
        }
        return response;
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT update Event, duplicate tmnt_id+event_name`);          
        } else {
          testResults += addToResults(`Update Event Error: did not return 422 for duplicate tmnt_id+event_name`, false)                  
          return {
            error: `Error Updating Event, non 422 response for duplicate tmnt_id+event_name`,
            status: error.response.status,
          };          
        }                
        return error;
      }
    }

    try {
      // 1) valid full event object
      const updated = await updateValid();

      // 2) invalid Event object
      await invalidUpdate('tmnt_id', 'bwl_123');
      await invalidUpdate('event_name', '');
      await invalidUpdate('team_size', 1234567890);
      await invalidUpdate('games', 0);      
      await invalidUpdate('added_money', 'abc');
      await invalidUpdate('entry_fee', '-1');
      await invalidUpdate('lineage', 'abc');
      await invalidUpdate('prize_fund', '1234567890');
      await invalidUpdate('other', '-1');
      await invalidUpdate('expenses', '1234567890');      
      await invalidUpdate('sort_order', 'abc');
      await invalidUpdate('lpox', '123');      // entry_fee !== lpox
      await invalidUpdate('entry_fee', '123'); // entry_fee !== lpox
      await invalidUpdate('lineage', '123');    // entry_fee !== lpox

      // 3) invalid Event id
      await dontUpdateInvalidId('abc_123');
      // 4 non existing Event id
      await dontUpdateInvalidId('evt_12345678901234567890123456789012');

      // 5) duplicate Event
      await dontUpdateDuplicate();

      return updated;
    } catch (error: any) {
      testResults += addToResults(`Update Error: ${error.message}`, false);
      setResults(testResults)
      return {
        error: error.message,
        status: 404,
      };  
    } finally {
      const reset = await resetEventToUpdate(false);
      if (passed) {
        testResults += addToResults(`Update Event tests: PASSED`, true);
      } else {
        testResults += addToResults(`Update Event tests: FAILED`, false);
      }
      setResults(testResults);      
    }
  };

  const eventPatch = async () => {
    let testResults = results + 'Patch Event tests: \n';
    passed = true;

    const doPatch = async (propertyName: string, value: any, matchValue: any) => {

      // const eventEntryFee = Number(eventToUpdate.entry_fee);
      // const eventLineage = Number(eventToUpdate.lineage)
      // const eventPrizeFund = Number(eventToUpdate.prize_fund)
      // const eventOther = Number(eventToUpdate.other)
      // const eventExpenses = Number(eventToUpdate.expenses)
      try {
        // let patchJSON 
        // if lineage, prize_fund, other, expenses are changed
        // need to recalculate entry_fee; entry_fee = lineage + prize_fund + other - expenses
        // if (propertyName === "lineage" || propertyName === "prize_fund"
        //   || propertyName === "other" || propertyName === "expenses") {
        //   const valueAmount = Number(value)
        //   let entryFeeChange = 0          
        //   switch (propertyName) {
        //     case "lineage":
        //       entryFeeChange = valueAmount - eventLineage              
        //       break;
        //     case "prize_fund":
        //       entryFeeChange = valueAmount - eventPrizeFund
        //       break;
        //     case "other":
        //       entryFeeChange = valueAmount - eventOther
        //       break;
        //     case "expenses":
        //       entryFeeChange = valueAmount - eventExpenses
        //       break;
        //     default:
        //       break;
        //   }
        //   const patchedEntryFee = eventEntryFee + entryFeeChange
        //   patchJSON = JSON.stringify({
        //     entry_fee: patchedEntryFee + '',
        //     [propertyName]: value,
        //   })
        // } else {
          const patchJSON = JSON.stringify({          
            [propertyName]: value,
          })
        // }
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: eventIdUrl,
        })
        if (response.status === 200) {          
          if (response.data.event[propertyName] === matchValue) {
            testResults += addToResults(`Patched Event: ${eventToUpdate.event_name} - just ${propertyName}`)                        
          } else {
            testResults += addToResults(`DID NOT Patch Event ${propertyName}`, false)            
          }
          return {
            data: response.data.event,
            status: response.status
          };
        } else {
          testResults += addToResults(`doPatch Error: ${propertyName}`, false)          
          return {
            error: `Error Patching ${propertyName}`,
            status: response.status,
          };
        }
      } catch (error: any) {
        testResults += addToResults(`doPatch Error: ${error.message}`, false);        
        return {
          error: error.message,
          status: 404,
        };
      } finally {
        const reset = await resetEventToUpdate(false);
      }
    }

    const dontPatch = async (propertyName: string, value: any) => {       
      try {
        const dontPatchJSON = JSON.stringify({
          ...eventToUpdate,
          [propertyName]: value,
        })
        const response = await axios({
          method: "patch",
          data: dontPatchJSON,
          withCredentials: true,
          url: eventIdUrl,
        })      
        if (response.status !== 422) {
          testResults += addToResults(`Patch Error: did not return 422 for invalid ${propertyName}`, false)                  
          return {
            error: 'Error Patching Event',
            status: response.status,
          };          
        } else {
          testResults += addToResults(`Patch Event, non 422 response for event: ${eventToUpdate.event_name} - invalid ${propertyName}`)
          return {
            error: 'Error Patching Event',
            status: response.status,
          };          
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Patch Event: ${eventToUpdate.event_name} - invalid ${propertyName}`)
          return {
            error: '',
            status: error.response.status,
          }
        } else {
          testResults += addToResults(`Patch Error: did not return 422 for invalid ${propertyName}`, false)                  
          return {
            error: `Error Patching ${propertyName}`,
            status: error.response.status,
          };          
        }
      }    
    }

    const dontPatchInvalidId = async (id: string) => {      
      try {
        const invalidUrl = url + "/" + id;
        const invalidJSON = JSON.stringify(eventUpdatedTo);
        const notUpdatedResponse = await axios({
          method: "patch",
          data: invalidJSON,
          withCredentials: true,
          url: invalidUrl,
        });        

        if (notUpdatedResponse.status === 200) {
          testResults += addToResults(`Error: patched invalid id: ${id}`);          
          return notUpdatedResponse;
        } else {
          testResults += addToResults(`DID NOT patch Event, invalid id: ${id}`);
        }
        return notUpdatedResponse;        
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`DID NOT patch Event, invalid id: ${id}`);          
        } else {
          testResults += addToResults(`Patch Event Error: did not return 404 for invalid id: ${id}`, false)                  
          return {
            error: `Error Patching Event, non 404 response for invalid id: ${id}`,
            status: error.response.status,
          };          
        }                
      }
    };    

    const dontPatchDuplicate = async (propertyName: string, value: any) => {
      try {
        const duplicateId = 'evt_cb55703a8a084acb86306e2944320e8d'
        const duplicateIdUrl = url + "/" + duplicateId
  
        const dupJSON = JSON.stringify({
          ...eventToUpdate,
          [propertyName]: value,
        })
        const response = await axios({
          method: "patch",
          data: dupJSON,
          withCredentials: true,
          url: duplicateIdUrl,
        })      
        if (response.status !== 422) {
          testResults += addToResults(`Patch Error: did not return 422 for duplicate event_name+tmnt_id`, false)                  
          return {
            error: 'Error Patching Event',
            status: response.status,
          };          
        } else {
          testResults += addToResults(`Patch Event, non 422 response for duplicate event_name+tmnt_id`)
          return {
            error: 'Error Patching Event',
            status: response.status,
          };          
        }
      } catch (error: any) {
        if (error.response.status === 422) {
          testResults += addToResults(`DID NOT Patch Event: ${eventToUpdate.event_name} - duplicate event_name+tmnt_id`)
          return {
            error: '',
            status: error.response.status,
          }
        } else {
          testResults += addToResults(`Patch Error: did not return 422 for duplicate event_name+tmnt_id`, false)                  
          return {
            error: `Error Patching duplicate event_name+tmnt_id`,
            status: error.response.status,
          };          
        }
      }          
    }

    const doPatchLpox = async () => {
      try {
        const patchJSON = JSON.stringify({          
          entry_fee: '100',
          lineage: '30',
          prize_fund: '65',
          other: '0',
          expenses: '5',
          lpox: '100',
        })
        const response = await axios({
          method: "patch",
          data: patchJSON,
          withCredentials: true,
          url: eventIdUrl,
        })
        if (response.status === 200) {          
          if (response.data.event.lpox === '100') {
            testResults += addToResults(`Patched Event: ${eventToUpdate.event_name} - LPOX`)                        
          } else {
            testResults += addToResults(`DID NOT Patch Event LPOX`, false)            
          }
          return {
            data: response.data.event,
            status: response.status
          };
        } else {
          testResults += addToResults(`doPatch Error: LPOX`, false)          
          return {
            error: `Error Patching LPOX`,
            status: response.status,
          };
        }        
      } catch (err: any) {
        testResults += addToResults(`doPatch Lpox Error: ${err.message}`, false);        
        return {
          error: err.message,
          status: 404,
        };
      } finally {
        const reset = await resetEventToUpdate(false);
      }
    }

    try {      
      // cant patch the tmnt_id

      await doPatch('event_name', 'Testing Event * ', 'Testing Event')
      await doPatch('event_name', '<script>alert(1)</script>', 'alert1')
      await dontPatch('event_name', '<script></script>')

      await doPatch('team_size', 5, 5)
      await dontPatch('team_size', 123)

      await doPatch('games', 2, 2)
      await dontPatch('games', 123)

      await doPatch('added_money', '1000', '1000')
      await dontPatch('added_money', 'abc123')

      await dontPatch('entry_fee', '110')   // lpox error
      await dontPatch('entry_fee', '-3')    // invalid value

      await dontPatch('lineage', '12')      // lpox error
      await dontPatch('lineage', 'abc123')  // invalid value

      await dontPatch('prize_fund', '100')
      await dontPatch('prize_fund', 'abc123')

      await dontPatch('other', '5')
      await dontPatch('other', 'abc123')

      await dontPatch('expenses', '50')
      await dontPatch('expenses', 'abc123')

      await doPatchLpox()

      await dontPatchDuplicate('event_name', 'Singles')      

      await dontPatchInvalidId('abc_123')
      await dontPatchInvalidId('bwl_12345678901234567890123456789012')

      return eventToUpdate;    
    } catch (error: any) {
      testResults += addToResults(`Patch Error: ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };  
    } finally {
      const reset = await resetEventToUpdate(false);      
      if (passed) {
        testResults += addToResults(`Patch Event tests: PASSED`, true);
      } else {
        testResults += addToResults(`Patch Event tests: FAILED`, false);
      }
      setResults(testResults)
    }
  };

  const eventDelete = async (eventIdToDel: string, testing: boolean = true) => {
    let testResults = results + 'Delete Event tests: \n';
    if (!testing) {
      passed = true;
    }    

    const invalidDelete = async (invalidId: string) => {      
      try {
        const invalidDelUrl = url + '/' + invalidId
        const cantDelResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: invalidDelUrl,
        })
        if (cantDelResponse.status === 404) {
          testResults += addToResults(`Did not not delete Event with invalid id: "${invalidId}"`)
        } else {
          testResults += addToResults(`Error: Could not delete Event with invalid id: "${invalidId}"`, false)
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          testResults += addToResults(`Did not not delete Event - invalid id: "${invalidId}"`)
        } else {
          testResults += addToResults(`Delete Event Error: ${error.message}`, false);          
          return {
            error: error.message,
            status: error.response.status,
          };
        }          
      }
    }

    const eventDelUrl = url +'/' + eventIdToDel
    try {
      const response = await axios({
        method: "delete",
        withCredentials: true,
        url: eventDelUrl,
      });
      if (response.status === 200) {
        // if eventIdToDel !== eventToDel.id, delete called from reset
        // DO NOT update on success
        // only show update on screen if in delete test
        if (eventIdToDel === eventToDel.id) {
          if (response.data.deleted.lpox === eventToDel.lpox) {
            testResults += addToResults(`Success: Deleted Event: ${eventToDel.event_name} - got lpox in response`);
          } else {
            testResults += addToResults(`Error Deleted Event: ${eventToDel.event_name}: no lpox`);            
            return {
              error: 'No lpox in response',
              status: 404,
            }
          }
          testResults += addToResults(`Success: Deleted Event: ${response.data.deleted.event_name}`);          
        }        
      } else {
        testResults += addToResults('Error: could not delete event', false)        
        return {
          error: 'Could not delete event',
          status: 404,
        };
      }

      if (testing) {
        // try to delete Event that is parent
        try {
          const cantDelUrl = url + '/' + eventToUpdate.id
          const cantDelResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: cantDelUrl,
          })
          if (cantDelResponse.status === 409) {
            testResults += addToResults(`Did not not delete event: ${eventToUpdate.event_name} with children`)
          } else {
            testResults += addToResults(`Error: Could not delete event: ${eventToUpdate.boevent_namel_name}`, false)            
          }
        } catch (error: any) {
          if (error.response.status === 409) {
            testResults += addToResults(`Did not not delete event: ${eventToUpdate.event_name} with children`)
          } else {
            testResults += addToResults(`Delete Event Error: ${error.message}`, false);            
            return {
              error: error.message,
              status: error.response.status,
            };
          }
        }        
        await invalidDelete('abc_123');        
        await invalidDelete('evt_12345678901234567890123456789012');        
      }
      return response.data;
    } catch (error: any) {
      testResults += addToResults(`Error : ${error.message}`, false);      
      return {
        error: error.message,
        status: 404,
      };
    } finally {
      await reAddDeletedEvent()
      if (testing) {
        if (passed) {
          testResults += addToResults(`Delete Event tests: PASSED`, true);
        } else {
          testResults += addToResults(`Delete Event tests: FAILED`, false);
        }
        setResults(testResults)        
      }
    }
  };

  const resetAll = async () => { 
    let testResults: string = ''
    try {
      const reset = await resetEventToUpdate(false);      
      if (reset.error) {
        testResults += addToResults(`Error Resetting: ${reset.error}`, false)        
        return;
      }

      const allEvents: any = await removeCreatedEvent(true)
      if (allEvents.error) {
        testResults += addToResults(`Error Resetting: ${allEvents.error}`, false)        
        return;
      }

      const reAdded: any = await reAddDeletedEvent()
      if (reAdded.error) {
        testResults += addToResults(`Error Resetting: ${reAdded.error}`, false)        
        return;
      }
      
      testResults += addToResults(`Reset Events`);;
      setResults(testResults);      
      return {
        events: allEvents,
        status: 200,
      }
    } catch (error: any) {
      testResults += addToResults(`Reset Error: ${error.message}`, false);     
      return {
        error: error.message,
        status: 404,
      };  
    } finally {
      setResults(testResults); 
    }
  }

  const handleCrudChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setEventCrud(e.target.value);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();    
    setResults('');
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();   
    await resetAll();
  };

  const handleEventTest = async (e: React.FormEvent) => {
    e.preventDefault();
    switch (eventCrud) {
      case "create":
        await eventCreate();
        break;
      case "read":
        await eventReadAll(true);
        break;
      case "read1":
        await eventRead1();
        break;
      case "update":
        await eventUpdate();
        break;
      case "patch":
        await eventPatch();
        break;
      case "delete":
        await eventDelete(eventToDel.id);
        break;
      case 'readTmnt':
        await eventReadForTmnt();
        break;
      default:
        break;
    }
  };

  const handleEventTestAll = async (e: React.FormEvent) => {
    e.preventDefault();
    allResults = 'Testing all...';    
    passed = true;
    try {
      await eventCreate();    
      allResults = results;
      await eventReadAll(true);
      allResults = results;
      await eventRead1();
      allResults = results;
      await eventUpdate();
      allResults = results;
      await eventPatch();
      allResults = results;
      await eventDelete(eventToDel.id);      
      allResults = results;
    } catch (error: any) {
      allResults += addToResults(`Test All Error: ${error.message}`, false);
      setResults(allResults)
      return {
        error: error.message,
        status: 404,
      };  
      
    } finally {
      allResults = results;
      await resetAll()
      allResults += addToResults(`Test All Complete`, passed);
      setResults(allResults)
    }
  };

  return (
    <>      
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <h4>Events</h4>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-success"
            id="eventTest"
            onClick={handleEventTest}
          >
            Test
          </button>
        </div>
        {/* <div className="col-sm-2">
          <button
            className="btn btn-primary"
            id="eventTestAll"
            onClick={handleEventTestAll}
          >
            Test All
          </button>
        </div> */}
        <div className="col-sm-2">
          <button
            className="btn btn-warning"
            id="eventClear"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-info"
            id="eventReset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-2">
          <label htmlFor="eventCreate" className="form-check-label">
            &nbsp;Create &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventCreate"
            name="event"
            value="create"
            checked={eventCrud === "create"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="eventRead" className="form-check-label">
            &nbsp;Read All &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventRead"
            name="event"
            value="read"
            checked={eventCrud === "read"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="eventRead1" className="form-check-label">
            &nbsp;Read 1 &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventRead1"
            name="event"
            value="read1"
            checked={eventCrud === "read1"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="eventUpdate" className="form-check-label">
            &nbsp;Update &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventUpdate"
            name="event"
            value="update"
            checked={eventCrud === "update"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="eventPatch" className="form-check-label">
            &nbsp;Patch &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventPatch"
            name="event"
            value="patch"
            checked={eventCrud === "patch"}
            onChange={handleCrudChange}
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="eventDelete" className="form-check-label">
            &nbsp;Delete &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventDelete"
            name="event"
            value="delete"
            checked={eventCrud === "delete"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">    
        <div className="col-sm-4">
        </div>
        <div className="col-sm-3">
          <label htmlFor="eventReadTmnt" className="form-check-label">
            &nbsp;Read Tmnt &nbsp;
          </label>
          <input
            type="radio"
            className="form-check-input"
            id="eventReadTmnt"
            name="event"
            value="readTmnt"
            checked={eventCrud === "readTmnt"}
            onChange={handleCrudChange}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">        
        <div className="col-sm-12">
          <textarea
            id="eventResults"
            name="eventResults"               
            rows={10}            
            value={results}            
            readOnly={true}
          >            
          </textarea>
        </div>
      </div>
    </>
  );
};
