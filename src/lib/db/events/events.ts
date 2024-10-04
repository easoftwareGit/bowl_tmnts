"use server";

// these functions need to be in a file with "use server" at the top
// prima is a server only, using these functions without the "use server"
// directive in a client file will cause an error.

import { prisma } from "@/lib/prisma"; // for production & developemnt
// import prisma from '../../../../test/client'  // for testing

import {
  ErrorCode,
  isValidBtDbId,  
} from "@/lib/validation";
import { eventType } from "@/lib//types/types";
import { sanitizeEvent, validateEvent } from "@/app/api/events/validate";
import { initEvent } from "../initVals";

/**
 * finds one event by searching for a matching event id
 *
 * @param id - event id
 * @return {Object|null} Object = event's data; mull = event not found
 */
export async function findEventById(id: string) {
  try {
    // validate the id as an event id
    if (!isValidBtDbId(id, "evt")) {
      return null;
    }
    // find event in database by matching id
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    return event ? event : null;
  } catch (err) {
    if (err instanceof Error) {
      throw Error(err.message);
    } else {
      throw Error("error finding event");
    }
  }
}

/**
 * validates an array of events
 *
 * @param events - array of events
 * @returns {ErrorCode.None | ErrorCode.MissingData | ErrorCode.InvalidData | ErrorCode.OtherError} - error code
 *          None - all events are valid
 *          MissingData - one or more events are missing data
 *          InvalidData - one or more events have invalid data
 *          OtherError - other error
 */
export const validateEvents = (events: eventType[]): ErrorCode => {

  if (!events || events.length === 0) return ErrorCode.MissingData;
  // cannot use forEach because if got an errror need exit loop
  let i = 0;
  while (i < events.length) {
    const toPost = sanitizeEvent(events[i]);
    const errCode = validateEvent(toPost);
    if (errCode !== ErrorCode.None) {
      return errCode;
    }    
    i++;
  }
  return ErrorCode.None;
};

export const createManyEvents = async (events: eventType[]): Promise<eventType[] | null> => { 

  try {
    if (validateEvents(events) !== ErrorCode.None) return null
    const prismaEvents = await prisma.event.createManyAndReturn({
      data: [
        ...events,
      ]
    })
    // convert prismaEvents to events
    const manyEvents: eventType[] = [];
    prismaEvents.map((event) => {
      manyEvents.push({
        ...initEvent,
        id: event.id,
        tmnt_id: event.tmnt_id,        
        event_name: event.event_name,
        tab_title: event.event_name,
        team_size: event.team_size,
        games: event.games,
        added_money: event.added_money + '',
        entry_fee: event.entry_fee + '',
        lineage: event.lineage + '',
        prize_fund: event.prize_fund + '',
        expenses: event.expenses + '',
        other: event.other + '',
        lpox: event.entry_fee + '',
        sort_order: event.sort_order,
      })
    })
    return manyEvents
  } catch (err) {
    return null;
  }
}