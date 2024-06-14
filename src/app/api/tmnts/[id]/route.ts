import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { sanitizeTmnt, validateTmnt, validTmntDates, validTmntFkId, validTmntName } from "@/app/api/tmnts/valildate"
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
    if (!isValidBtDbId(id, 'tmt')) {
      return NextResponse.json(
        { error: 'not found' },
        { status: 404 }
      );
    }

    const tmnt = await prisma.tmnt.findUnique({
      where: {
        id: id
      }
    })    
    if (!tmnt) {
      return NextResponse.json(
        { error: "not found" },
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
    if (!isValidBtDbId(id, 'tmt')) {
      return NextResponse.json(
        { error: 'not found' },
        { status: 404 }
      );
    }

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
        
    const toPut: tmntType = sanitizeTmnt(toCheck);    
    const tmnt = await prisma.tmnt.update({
      where: {
        id: id
      },
      data: {
        tmnt_name: toPut.tmnt_name,
        start_date: toPut.start_date,
        end_date:toPut.end_date,
        user_id: toPut.user_id, 
        bowl_id: toPut.bowl_id,
      }
    })
    return NextResponse.json({ tmnt }, { status: 200 });        
  } catch (error: any) {
    let errStatus: number  
    switch (error.code) {      
      case 'P2025':
        errStatus = 404  
        break;      
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "Error putting bowl" },
      { status: errStatus }
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
    if (!isValidBtDbId(id, 'tmt')) {
      return NextResponse.json(
        { error: 'not found' },
        { status: 404 }
      );
    }

    const json = await request.json()
    // populate toCheck with json
    const jsonProps = Object.getOwnPropertyNames(json);
    const toCheck: tmntType = {
      ...initTmnt,
    }
    let errCode = ErrorCode.None;
    if (jsonProps.includes('tmnt_name')) { 
      if(!validTmntName(json.tmnt_name)) {
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.tmnt_name = json.tmnt_name
      }
    }
    let gotEmptyStartDate = undefined;
    let gotEmptyEndDate = undefined;
    if (jsonProps.includes('start_date') || jsonProps.includes('end_date')) { 
      if (!validTmntDates(json.start_date, json.end_date)) {
        errCode = ErrorCode.InvalidData
      } else {        
        toCheck.start_date = json.start_date
        toCheck.end_date = json.end_date
        if (!json.start_date && !json.end_date) {
          gotEmptyStartDate = '';
          gotEmptyEndDate = '';
        }
      }
    } 
    if (jsonProps.includes('bowl_id')) {
      if (!validTmntFkId(json.bowl_id, 'bwl')) {
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.bowl_id = json.bowl_id
      }     
    }
    if (jsonProps.includes('user_id')) {
      if (!validTmntFkId(json.user_id, 'usr')) {
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.user_id = json.user_id
      }     
    }
    if (errCode !== ErrorCode.None) { 
      let errMsg: string;
      switch (errCode as ErrorCode) {
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
      )
    }    

    const toPatch = sanitizeTmnt(toCheck); 
    const tmnt = await prisma.tmnt.update({
      where: {
        id: id
      },
      // remove data if not sent
      data: {
        tmnt_name: toPatch.tmnt_name || undefined,
        start_date: toPatch.start_date || gotEmptyStartDate,
        end_date: toPatch.end_date || gotEmptyEndDate,        
        bowl_id: toPatch.bowl_id || undefined,
        user_id: toPatch.user_id || undefined
      }
    })
    return NextResponse.json({ tmnt }, { status: 200 });    
  } catch (error: any) {
    let errStatus: number  
    switch (error.code) {      
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
      { error: "Error pasting tmnt" },
      { status: errStatus }
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
    if (!isValidBtDbId(id, 'tmt')) {
      return NextResponse.json(
        { error: 'not found' },
        { status: 404 }
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
        errStatus = 409      
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