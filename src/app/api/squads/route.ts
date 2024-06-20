import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeSquad, validateSquad } from "./validate";
import { ErrorCode, validPostId } from "@/lib/validation";
import { squadType } from "@/lib/types/types";
import { initSquad } from "@/db/initVals";

// routes /api/squads

export async function GET(request: NextRequest) {
  try {
    const squads = await prisma.squad.findMany({
      orderBy: [
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

export async function POST(request: Request) {
  try {
    const { id, event_id, squad_name, games, starting_lane, lane_count, squad_date, squad_time, sort_order } = await request.json()    
    const toCheck: squadType = {
      ...initSquad,
      event_id,
      squad_name,
      games,
      starting_lane,
      lane_count,
      squad_date,
      squad_time,      
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

    let postId = '';
    if (id) { 
      postId = validPostId(id, 'sqd');
      if (!postId) {
        return NextResponse.json(
          { error: "invalid data" },
          { status: 422 }
        );
      }
    }    

    const toPost = sanitizeSquad(toCheck);
    type squadDataType = {
      event_id: string,            
      squad_name: string,      
      games: number,        
      lane_count: number,      
      starting_lane: number,      
      squad_date: string,      
      squad_time: string | null,       
      sort_order: number,
      id?: string
    }
    let squadData: squadDataType = {
      event_id: toPost.event_id,            
      squad_name: toPost.squad_name,      
      games: toPost.games,        
      lane_count: toPost.lane_count,      
      starting_lane: toPost.starting_lane,      
      squad_date: toPost.squad_date,      
      squad_time: toPost.squad_time,      
      sort_order: toPost.sort_order
    }
    if (postId) {
      squadData.id = postId
    }

    const squad = await prisma.squad.create({
      data: squadData
    })
    return NextResponse.json({ squad }, { status: 201 })        
  } catch (err: any) {
    let errStatus: number
    switch (err.code) {
      case 'P2002': // Unique constraint
        errStatus = 422 
        break;
      case 'P2003': // Foreign key constraint
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