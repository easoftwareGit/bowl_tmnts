import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ErrorCode, validPostId } from "@/lib/validation";
import { tmntType } from "@/lib/types/types";
import { sanitizeTmnt, validateTmnt } from "./valildate";
import { initTmnt } from "@/db/initVals";

// routes /api/tmnts

export async function GET(request: NextRequest) {
  try {
    const skip = request.nextUrl.searchParams.get('skip')
    const take = request.nextUrl.searchParams.get('take')
    const tmnts = await prisma.tmnt.findMany({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    })
    // return NextResponse.json(tmnts);
    return NextResponse.json({ tmnts }, { status: 200 });    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting tmnts" },
      { status: 400 }
    );        
  }
}
  
export async function POST(request: Request) {  

  try {
    const { id, tmnt_name, start_date, end_date, user_id, bowl_id } = await request.json()    
    const toCheck: tmntType = {
      ...initTmnt, 
      tmnt_name,
      start_date,
      end_date,
      user_id,
      bowl_id
    }
    const toPost = sanitizeTmnt(toCheck);
    const errCode = validateTmnt(toPost);
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
      postId = validPostId(id, 'tmt');
      if (!postId) {
        return NextResponse.json(
          { error: 'invalid data' },
          { status: 422 }
        );
      }
    }
    
    type tmntDataType = {
      tmnt_name: string
      start_date: Date
      end_date: Date
      user_id: string
      bowl_id: string
      id?: string
    }
    let tmntData: tmntDataType = {
      tmnt_name: toPost.tmnt_name,
      start_date: toPost.start_date,
      end_date: toPost.end_date,
      user_id: toPost.user_id,
      bowl_id: toPost.bowl_id
    }
    if (postId) {
      tmntData.id = postId
    }

    const tmnt = await prisma.tmnt.create({
      data: tmntData
    })
    return NextResponse.json({ tmnt }, { status: 201 });
  } catch (error: any) {
    let errStatus: number
    switch (error.code) {
      case 'P2003': //parent row not found
        errStatus = 404
        break;    
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "error creating tmnt" },
      { status: errStatus }
    );        
  }
}