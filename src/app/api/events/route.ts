import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { validateEvent, eventToCheck } from "@/app/api/events/validate";
import { ErrorCode } from "@/lib/validation";

// routes /api/events

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: [
        {
          id: 'asc',
        }, 
        {
          tmnt_id: 'asc',
        }, 
        {
          sort_order: 'asc',
        }, 
      ]
    })
    return NextResponse.json({events}, {status: 200});
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting events" },
      { status: 500 }
    );        
  }
}

// {
//   "tmnt_id": "tmt_467e51d71659d2e412cbc64a0d19ecb4",
//   "event_name": "Singles",
//   "team_size": 1,
//   "games": 6,
//   "sort_order": 1
// }

export async function POST(request: Request) {
  try {
    const { tmnt_id, event_name, team_size, games, sort_order } = await request.json()    
    const toCheck: eventToCheck = {
      tmnt_id,
      event_name,
      team_size,
      games,
      sort_order
    }

    const errCode = validateEvent(toCheck);
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode) {
        case ErrorCode.MissingData:
          errMsg = 'missing data'
          break;
        case ErrorCode.InvalidData:
          errMsg = 'invalid data'
          break;        
        default:
          errMsg = 'unknown error'
          break;
      }
      return NextResponse.json(
        { error: errMsg },
        { status: 422 }
      );
    }

    const san_event_name = sanitize(event_name);
    const event = await prisma.event.create({
      data: {
        tmnt_id,
        event_name: san_event_name,
        team_size,
        games,
        sort_order
      }
    })
    return new NextResponse(JSON.stringify(event), { status: 201 })    
  } catch (err: any) {
    let errStatus: number
    switch (err.code) {
      case 'P2003':
        errStatus = 422
        break;    
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "error creating event" },
      { status: errStatus }
    );        
  }
}