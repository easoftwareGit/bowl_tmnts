import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { ErrorCode } from "@/lib/validation";
import { tmntType } from "@/lib/types/types";
import { validateTmnt } from "./valildate";
import { startOfDay } from "date-fns";
import { initTmnt } from "@/app/dataEntry/tmnt/initVals";

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
    return NextResponse.json({ data: tmnts }, { status: 200 });    
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
    const { tmnt_name, start_date, end_date, user_id, bowl_id } = await request.json()    
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

    const san_tmnt_name = sanitize(tmnt_name);
    const startDate = startOfDay(new Date(start_date)) 
    const endDate = startOfDay(new Date(end_date))
    const tmnt = await prisma.tmnt.create({
      data: {
        tmnt_name: san_tmnt_name,
        start_date: startDate,
        end_date: endDate,
        user_id: user_id,
        bowl_id: bowl_id,
      }
    })
    return new NextResponse(JSON.stringify(tmnt), { status: 201 })    
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
      { error: "error creating tmnt" },
      { status: errStatus }
    );        
  }
}