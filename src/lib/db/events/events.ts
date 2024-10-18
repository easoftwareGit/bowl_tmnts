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
import { eventType, validEventsType } from "@/lib//types/types";
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