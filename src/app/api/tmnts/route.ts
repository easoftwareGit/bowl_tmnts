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

// {    
//   "tmnt_name": "Silver Pin",
//   "start_date": "2023-12-31",
//   "end_date": "2023-12-31",
//   "user_id": "usr_5bcefb5d314fff1ff5da6521a2fa7bde",
//   "bowl_id": "bwl_561540bd64974da9abdd97765fdb3659"
// }
  
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
    const errCode = validateTmnt(toCheck);
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

    const toPost = sanitizeTmnt(toCheck);
    type tmntDataType = {
      tmnt_name: string
      start_date: string
      end_date: string
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

    // const san_tmnt_name = sanitize(tmnt_name);
    // const startDate = startOfDay(new Date(start_date)) 
    // const endDate = startOfDay(new Date(end_date))
    // const tmnt = await prisma.tmnt.create({
    //   data: {
    //     tmnt_name: san_tmnt_name,
    //     start_date: startDate,
    //     end_date: endDate,
    //     user_id: user_id,
    //     bowl_id: bowl_id,
    //   }
    // })

    return NextResponse.json({ tmnt }, { status: 201 });
  } catch (error: any) {
    let errStatus: number
    switch (error.code) {
      case 'P2003':
        errStatus = 422
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