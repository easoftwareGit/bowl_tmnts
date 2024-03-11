import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { validateSquad, squadToCheck } from "./validate";
import { ErrorCode } from "@/lib/validation";
import { startOfDay } from "date-fns";

// routes /api/squads

export async function GET(request: NextRequest) {
  try {
    const squads = await prisma.squad.findMany({
      orderBy: [
        {
          id: 'asc',
        }, 
        {
          event_id: 'asc',
        }, 
        {
          sort_order: 'asc',
        }, 
      ]
    })
    return NextResponse.json({squads}, {status: 200});
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting squads" },
      { status: 500 }
    );        
  }
}

// {
//   "event_id": "evt_cb97b73cb538418ab993fc867f860510",
//   "squad_name": "Squad 1",
//   "squad_date": "2022-10-23",
//   "squad_time": "02:00 PM",
//   "games": 6,
//   "sort_order": 2
// }

export async function POST(request: Request) {
  try {
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
    const squad = await prisma.squad.create({
      data: {
        event_id,        
        squad_name: san_squad_name,
        squad_date: squadDate,
        squad_time,
        games,
        sort_order
      }
    })
    return new NextResponse(JSON.stringify(squad), { status: 201 })    
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
      { error: "error creating squad" },
      { status: errStatus }
    );        
  }
}