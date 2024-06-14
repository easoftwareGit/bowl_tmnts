import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { validateSquad, squadToCheck, validSquadData } from "@/app/api/squads/validate";
import { startOfDay } from "date-fns";

// routes /api/events/:id

// sqd_7116ce5f80164830830a7157eb093396

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   

  try {
    const id = params.id;
    if (!isValidBtDbId(id, 'sqd')) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 404 }
      );        
    }
    const squad = await prisma.squad.findUnique({
      where: {
        id: id
      }
    })
    // return NextResponse.json(squad);
    return NextResponse.json({squad}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting squad" },
      { status: 500 }
    );        
  } 
}

// sqd_7116ce5f80164830830a7157eb093396
// {  
//   "event_id": "evt_cb97b73cb538418ab993fc867f860510",
//   "squad_name": "Squad 2",
//   "squad_date": "2022-10-31",
//   "squad_time": "10:00 AM",
//   "games": 5,
//   "sort_order": 2
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id, 'sqd')) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 404 }
      );        
    }

    const { event_id, squad_name, squad_date, squad_time, games, sort_order } = await request.json()    
    const toCheck: squadToCheck = {
      event_id,
      squad_name,
      squad_date,
      squad_time,
      games,
      sort_order
    }

    const errCode = validateSquad(toCheck);
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
    
    const san_squad_name = sanitize(squad_name);
    const squadDate = startOfDay(new Date(squad_date))
    const updated = await prisma.squad.update({
      where: {
        id: id
      },      
      data: {
        event_id,
        squad_name: san_squad_name,
        squad_date: squadDate,
        squad_time,
        games,
        sort_order
      }
    })
    return NextResponse.json({updated}, {status: 200});    
  } catch (err: any) {

    console.log('err: ', err)

    let errStatus: number   
    switch (err.code) {
      case 'P2003':
        errStatus = 422        
        break;    
      case 'P2025': 
        errStatus = 422        
        break;    
      default:
        errStatus = 500        
        break;
    }
    return NextResponse.json(
      { error: "error updating squad" },
      { status: errStatus }
    );        
  }
}

// change any 1..N of the values in the object, pass onnly changed value(s)
// sqd_7116ce5f80164830830a7157eb093396
// {  
//   "event_id": "evt_cb97b73cb538418ab993fc867f860510",
//   "squad_name": "Squad 2",
//   "squad_date": "2022-10-31",
//   "squad_time": "10:00 AM",
//   "games": 5,
//   "sort_order": 2
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id    
    if (!isValidBtDbId(id, 'sqd')) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 404 }
      );        
    }

    const { event_id, squad_name, squad_date, squad_time, games, sort_order } = await request.json()    
    const toCheck: squadToCheck = {
      event_id,
      squad_name,
      squad_date,
      squad_time,
      games,
      sort_order
    }
    if (validSquadData(toCheck) !== ErrorCode.None) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

    const san_squad_name = sanitize(squad_name);
    const p_squadDate = (typeof squad_date === 'string') ? startOfDay(new Date(squad_date)) : undefined;
    const p_games = (typeof games === 'number') ? games : undefined;
    const p_sort_order = (typeof sort_order === 'number') ? sort_order : undefined;
    const updated = await prisma.squad.update({
      where: {
        id: id
      },    
      data: {
        event_id: event_id || undefined,
        squad_name: san_squad_name || undefined,
        squad_date: p_squadDate,
        squad_time,
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
      { error: "error patching squad" },
      { status: errStatus }
    );        
  }
}

// sqd_7116ce5f80164830830a7157eb093396

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id, 'sqd')) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 404 }
      );        
    }

    const deleted = await prisma.squad.delete({
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
      { error: "error deleting squad" },
      { status: errStatus }
    );        
  }
}