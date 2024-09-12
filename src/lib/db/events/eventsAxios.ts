import axios from "axios";
import { baseEventsApi } from "@/lib/db/apiPaths";
import { testBaseEventsApi } from "../../../../test/testApi";
import { eventType } from "@/lib/types/types";
import { validateEvent } from "@/app/api/events/validate";

const url = testBaseEventsApi.startsWith("undefined")
  ? baseEventsApi
  : testBaseEventsApi;   

/**
 * posts an event
 * 
 * @param {eventType} event - event to post
 * @returns - event posted or null
 */  
export const postEvent = async (event: eventType): Promise<eventType | null> => {
  
  // all sanatation and validation done in POST route

  try {
    const eventJSON = JSON.stringify(event);
    const response = await axios({
      method: "post",
      data: eventJSON,
      withCredentials: true,
      url: url,
    });
    return (response.status === 201)
      ? response.data.event
      : null
  } catch (err) {
    return null;
  }
}

/**
 * puts an event
 * 
 * @param {eventType} event - event to put
 * @returns - event putted or null
 */  
export const putEvent = async (event: eventType): Promise<eventType | null> => {
  
  // all sanatation and validation done in PUT route

  try {
    const eventJSON = JSON.stringify(event);
    const response = await axios({
      method: "put",
      data: eventJSON,
      withCredentials: true,
      url: url + "/" + event.id,
    });
    return (response.status === 200)
      ? response.data.event
      : null
  } catch (err) {
    return null;
  }
}

/**
 * deletes an event
 * 
 * @param {eventType} event - event to delete
 * @returns - event putted or null
 */  
export const deleteEvent = async (event: eventType): Promise<eventType | null> => { 

  // all sanatation and validation done in DELETE route

  try {
    const response = await axios({
      method: "delete",
      withCredentials: true,
      url: url + "/" + event.id,
    });
    return (response.status === 200)
      ? response.data.deleted
      : null
  } catch (err) {
    return null;
  }
}