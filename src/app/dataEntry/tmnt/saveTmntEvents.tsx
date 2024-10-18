import { deleteEvent, postEvent, postManyEvents, putEvent } from "@/lib/db/events/eventsAxios";
import { eventType, saveTypes} from "@/lib/types/types";
import { isValidBtDbId } from "@/lib/validation";

/**
 * creates, updates or deletes tmnt events based on event status
 * 
 * @param {eventType[]} origEvents - original events in tmnt
 * @param {eventType[]} events - current events to save
 * @returns array of saved current events or null
 */
const tmntPostPutOrDelEvents = async (origEvents: eventType[], events: eventType[]): Promise<eventType[] | null> => {
  
  const savedEvents: eventType[] = [];
  // if user has deleted an event, the event will be in origEvents
  // and not in events. Delete the event from the db.
  for (let i = 0; i < origEvents.length; i++) {
    const event = origEvents[i];
    if (isValidBtDbId(event.id, 'evt')) {
      const foundEvent = events.find((e) => e.id === event.id);
      if (!foundEvent) {
        const delEventCount = await deleteEvent(event.id);
        if (delEventCount !== 1) return null
      }
    }
  }

  // if user has added an event, the event will be in events
  for (let i = 0; i < events.length; i++) {         
    // if not a new event 
    if (isValidBtDbId(events[i].id, 'evt')) {     
      // find origonal event
      const foundOrig = origEvents.find((e) => e.id === events[i].id);
      if (foundOrig) {
        // if original event has been edited, put currennt event
        if (JSON.stringify(foundOrig) !== JSON.stringify(events[i])) { 
          const puttedEvent = await putEvent(events[i]);
          if (!puttedEvent) return null
          savedEvents.push(puttedEvent);
        } else { // else original event has not been edited
          savedEvents.push(foundOrig);          
        }
      } else { // else a new event
        const postedEvent = await postEvent(events[i]);    
        if (!postedEvent) return null     
        savedEvents.push(postedEvent);
      }
    }    
  }  
  return savedEvents;
}

/**
 * saves tmnt events
 * 
 * @param {eventType[]} origEvents - original events in tmnt
 * @param {eventType[]} events - current events to save
 * @param {saveTypes} saveType - 'CREATE' or 'UPDATE'
 * @returns - array of saved current events or null (if an event is not edited, it will be included in the returned array)  
 */
export const tmntSaveEvents = async (origEvents: eventType[], events: eventType[], saveType: saveTypes): Promise<eventType[] | null> => { 

  if (!origEvents || !events || !saveType) return null;
  if (saveType === 'CREATE') {
    return await postManyEvents(events) 
  } else if (saveType === 'UPDATE') {
    return await tmntPostPutOrDelEvents(origEvents, events)
  } else {  
    return null
  }
}

export const exportedForTesting = {  
  tmntPostPutOrDelEvents,    
};
