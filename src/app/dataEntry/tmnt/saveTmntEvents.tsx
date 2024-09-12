import { validateEvents } from "@/lib/db/events/events";
import { deleteEvent, postEvent, putEvent } from "@/lib/db/events/eventsAxios";
import { initEvent } from "@/lib/db/initVals";
import { eventType, squadType } from "@/lib/types/types";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";

export type saveEventsType = {
  origEvents: eventType[];
  events: eventType[];
  setEvents: (events: eventType[]) => void;
  squads: squadType[];
  setSquads: (squads: squadType[]) => void;
}
const tmntPostPutOrDelEvents = async (toSave: saveEventsType): Promise<boolean> => {
  const { origEvents, events, setEvents, squads, setSquads } = toSave;

  // if user has deleted an event, the event will be in origEvents
  // and not in events. Delete the event from the db.
  for (let i = 0; i < origEvents.length; i++) {
    const event = origEvents[i];
    if (!isValidBtDbId(event.id, 'evt')) {
      const foundEvent = events.find((e) => e.id === event.id);
      if (!foundEvent) {
        const delEvent = await deleteEvent(event);
        if (!delEvent) return false
      }
    }
  }
  // origEvents.forEach((event) => {
  //   if (!isValidBtDbId(event.id, 'evt')) {
  //     const foundEvent = events.find((e) => e.id === event.id);
  //     if (!foundEvent) {
  //       const delEvent = deleteEvent(event);
  //       if (!delEvent) return false
  //     }
  //   }
  // });  

  for (let i = 0; i < events.length; i++) {         
    // if not a new event 
    if (isValidBtDbId(events[i].id, 'evt')) {     
      // find origonal event
      const foundOrig = origEvents.find((e) => e.id === events[i].id);
      if (foundOrig) {
        // if original event has been edited, put currennt event
        if (JSON.stringify(foundOrig) !== JSON.stringify(events[i])) { 
          const puttedEvent = await putEvent(events[i]);
          if (!puttedEvent) return false
        }
      }
      // no need to call setSquads after put, becuase event id is not changed
    } else { 
      // else a new event
      const currentEventId = events[i].id;
      // reset id to blank to have database generate a new id
      const toPost = {
        ...events[i],
        id: ''
      };
      const postedEvent = await postEvent(toPost);    
      if (!postedEvent) return false        
      setEvents(
        events.map((event) => {
          if (event.id === currentEventId) {
            event.id = postedEvent.id;
          }
          return event;
        })
      )  
      // update event id in squads
      setSquads(
        squads.map((squad) => {
          if (squad.event_id === currentEventId) {
            squad.event_id = postedEvent.id;
          }
          return squad;
        })
      )
    }    
  }  
  return true;
}

const tmntPostEvents = async (toSave: saveEventsType): Promise<boolean> => {
  const { events, setEvents, squads, setSquads } = toSave;
  for (let i = 0; i < events.length; i++) {      
    const currentEventId = events[i].id;
    events[i].id = '';
    const postedEvent = await postEvent(events[i]);      
    if (!postedEvent) return false;
    // update event id events
    setEvents(
      events.map((event) => {
        if (event.id === currentEventId) {
          event.id = postedEvent.id;
        }
        return event;
      })
    )
    // update event id in squads
    setSquads(
      squads.map((squad) => {
        if (squad.event_id === currentEventId) {
          squad.event_id = postedEvent.id;
        }
        return squad;
      })
    )
  }
  return true;  
}

export const tmntSaveEvents = async (toSave: saveEventsType): Promise<boolean> => { 

  const { origEvents, events, setEvents, squads, setSquads } = toSave;
  if (!origEvents || !events || !setEvents || !squads || !setSquads) return false
  // if any event is invalid, do not save
  const errCode = validateEvents(events);
  if (errCode !== ErrorCode.None) return false
  // if saving a new tmnt, then post events
  const initId = initEvent.id;  
  if (origEvents.length === 1 && origEvents[0].id === initId) {
    return tmntPostEvents(toSave);
  } else {  // else saving edits
    return tmntPostPutOrDelEvents(toSave);
  }  
}

export const exportedForTesting = {  
  tmntPostPutOrDelEvents,
  tmntPostEvents,
};
