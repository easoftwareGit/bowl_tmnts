import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { validateEvent, eventToCheck, validEventData } from "@/app/api/events/validate";

// routes /api/events/:id

// evt_cb97b73cb538418ab993fc867f860510

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   

  try {
    const id = params.id;
    if (!isValidBtDbId(id)) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 400 }
      );        
    }
    const event = await prisma.event.findUnique({
      where: {
        id: id
      }
    })
    // return NextResponse.json(event);
    return NextResponse.json({event}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting event" },
      { status: 500 }
    );        
  } 
}

// evt_dadfd0e9c11a4aacb87084f1609a0afd
// {
//   "tmnt_id": "tmt_56d916ece6b50e6293300248c6792316",
//   "event_name": "Singles",
//   "team_size": 1,
//   "games": 6,
//   "sort_order": 1
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id)) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

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
    const updated = await prisma.event.update({
      where: {
        id: id
      },      
      data: {
        tmnt_id,
        event_name: san_event_name,
        team_size,
        games,
        sort_order,
      }
    })
    return NextResponse.json({updated}, {status: 200});    
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
      { error: "error updating event" },
      { status: errStatus }
    );        
  }
}

// change any 1..N of the values in the object, pass onnly changed value(s)
// evt_dadfd0e9c11a4aacb87084f1609a0afd
// {
//   "tmnt_id": "tmt_56d916ece6b50e6293300248c6792316",
//   "event_name": "Singles",
//   "team_size": 1,
//   "games": 6,
//   "sort_order": 1
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id    
    if (!isValidBtDbId(id)) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

    const { tmnt_id, event_name, team_size, games, sort_order } = await request.json()
    const toCheck: eventToCheck = {
      tmnt_id,
      event_name,
      team_size,
      games,
      sort_order
    }
    if (validEventData(toCheck) !== ErrorCode.None) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

    const san_event_name = sanitize(event_name);
    const p_team_size = (typeof team_size === 'number') ? team_size : undefined;
    const p_games = (typeof games === 'number') ? games : undefined;
    const p_sort_order = (typeof sort_order === 'number') ? sort_order : undefined;
    const updated = await prisma.event.update({
      where: {
        id: id
      },    
      data: {
        tmnt_id: tmnt_id || undefined,
        event_name: san_event_name || undefined,
        team_size: p_team_size,
        games: p_games,
        sort_order: p_sort_order
      }
    })
    return NextResponse.json({updated}, {status: 200});    
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
      { error: "error patching event" },
      { status: errStatus }
    );        
  }
}

// evt_06055deb80674bd592a357a4716d8ef2

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id)) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

    const deleted = await prisma.event.delete({
      where: {
        id: id
      }
    })
    return NextResponse.json({deleted}, {status: 200});    
  } catch (err: any) {
    let errStatus: number    
    switch (err.code) {
      case 'P2003':
        errStatus = 422        
        break;   
      case 'P2025':
        errStatus = 404
        break;   
      default:
        errStatus = 500        
        break;
    }
    return NextResponse.json(
      { error: "error deleting event" },
      { status: errStatus }
    );        
  }
}