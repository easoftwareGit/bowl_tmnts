import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { sanitizeTmnt, validateTmnt } from "@/app/api/tmnts/valildate"
import { tmntType } from "@/lib/types/types";
import { startOfDay } from "date-fns";
import { initTmnt } from "@/db/initVals";

// routes /api/tmnts/:id

// tmt_9a34a65584f94f548f5ce3b3becbca19

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
    const tmnt = await prisma.tmnt.findUnique({
      where: {
        id: id
      }
    })    
    if (!tmnt) {
      return NextResponse.json(
        { error: "no tmnt found" },
        { status: 404 }
      );            
    }
    return NextResponse.json({tmnt}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting tmnt" },
      { status: 500 }
    );        
  } 
}

// tmt_fd99387c33d9c78aba290286576ddcff
// {    
//   "tmnt_name": "Silver Pin",
//   "start_date": "2023-12-31",
//   "end_date": "2023-12-31",
//   "user_id": "usr_516a113083983234fc316e31fb695b85",
//   "bowl_id": "bwl_8b4a5c35ad1247049532ff53a12def0a"
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { tmnt_name, start_date, end_date, user_id, bowl_id } = await request.json()
    const toCheck: tmntType = {
      ...initTmnt,
      tmnt_name,
      start_date,
      end_date,
      user_id,
      bowl_id
    }

    let errCode = validateTmnt(toCheck);
    if (errCode === ErrorCode.None) {
      if (!isValidBtDbId(id)) {
        errCode = ErrorCode.InvalidData;
      }
    }
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
        
    const toPut: tmntType = sanitizeTmnt(toCheck);    
    const created = await prisma.tmnt.create({
      data: {
        tmnt_name: toPut.tmnt_name,
        start_date: startOfDay(new Date(toPut.start_date)),
        end_date: startOfDay(new Date(toPut.end_date)),
        user_id: toPut.user_id, 
        bowl_id: toPut.bowl_id,
      }
    })
    return NextResponse.json({created}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error updating tmnt" },
      { status: 500 }
    );        
  } 
}

// tmt_fd99387c33d9c78aba290286576ddce5

// use any combo of keys in below object
// {    
//   "tmnt_name": "Silver Pin",
//   "start_date": "2023-12-31",
//   "end_date": "2023-12-31",
//   "user_id": "usr_516a113083983234fc316e31fb695b85",
//   "bowl_id": "bwl_8b4a5c35ad1247049532ff53a12def0a"
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { tmnt_name, start_date, end_date, user_id, bowl_id } = await request.json()
    const toCheck: tmntType = {
      ...initTmnt,
      tmnt_name,
      start_date,
      end_date,
      user_id,
      bowl_id
    }
    if (validateTmnt(toCheck) !== ErrorCode.None) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }
    
    const toPatch = sanitizeTmnt(toCheck);
    let startDate = undefined
    let endDate = undefined
    if (toPatch.start_date) {
      startDate = startOfDay(new Date(start_date))
    }      
    if (toPatch.end_date) {
      endDate = startOfDay(new Date(end_date))
    }          

    const updated = await prisma.tmnt.update({
      where: {
        id: id
      },    
      data: {
        tmnt_name: toPatch.start_date || undefined,
        start_date: startDate,
        end_date: endDate,
        user_id: user_id || undefined,
        bowl_id: bowl_id || undefined
      }
    })
    return NextResponse.json({updated}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error patching tmnt" },
      { status: 500 }
    );            
  }
}

// tmt_fd99387c33d9c78aba290286576ddcff

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
    const deleted = await prisma.tmnt.delete({
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
      { error: "error deleting tmnt" },
      { status: errStatus }
    );        
  }
}