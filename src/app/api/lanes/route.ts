import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateLane, sanitizeLane } from "./validate";
import { ErrorCode, validPostId } from "@/lib/validation";
import { laneType } from "@/lib/types/types";
import { initLane } from "@/lib/db/initVals";

// routes /api/lanes

export async function GET(request: NextRequest) {
  try {
    const lanes = await prisma.lane.findMany({
      orderBy: [
        {
          squad_id: 'asc',
        },
        {
          lane_number: 'asc',
        }
      ]      
    })
    return NextResponse.json({ lanes }, { status: 200 });        
  } catch (error: any) {
    return NextResponse.json(
      { error: "error getting events" },
      { status: 500 }
    );            
  }  
}

export const POST = async (request: NextRequest) => { 
  try {
    const { id, lane_number, squad_id } = await request.json();
    const toCheck: laneType = {
      ...initLane,
      id,
      lane_number,
      squad_id
    }

    const errCode = validateLane(toCheck);
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
      postId = validPostId(id, 'lan');
      if (!postId) {
        return NextResponse.json(
          { error: "invalid data" },
          { status: 422 }
        );
      }
    }

    const toPost = sanitizeLane(toCheck);
    type laneDataType = {
      squad_id: string,
      lane_number: number,
      id?: string
    }
    let laneData: laneDataType = {
      squad_id: toPost.squad_id,
      lane_number: toPost.lane_number
    }
    if (postId) {
      laneData.id = postId
    }
    const lane = await prisma.lane.create({
      data: laneData      
    })
    return NextResponse.json({ lane }, { status: 201 });    
  } catch (err: any) {
    let errStatus: number
    switch (err.code) {
      case 'P2002': // Unique constraint
        errStatus = 422 
        break;
      case 'P2003': // Foreign key constraint
        errStatus = 422
        break;    
      case 'P2025': // Record not found
        errStatus = 404
        break;
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "error creating lane" },
      { status: errStatus }
    );        
  }
}
