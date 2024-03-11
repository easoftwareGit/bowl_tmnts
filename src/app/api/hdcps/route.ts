import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateHdcp, hdcpToCheck } from "./validate";
import { ErrorCode } from "@/lib/validation";

// routes /api/hdcp

export async function GET(request: NextRequest) {
  try {
    const hdcps = await prisma.hdcp.findMany({
      orderBy: [
        {
          id: 'asc',
        }, 
        {
          div_id: 'asc',
        }
      ]
    })
    return NextResponse.json({hdcps}, {status: 200});
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting hdcps" },
      { status: 500 }
    );        
  }
}

// {
//   "div_id": "div_24b1cd5dee0542038a1244fc2978e862",
//   "hdcp_from": 225,
//   "int_hdcp": false,
//   "game": false
// }

export async function POST(request: Request) {
  try {
    const { div_id, hdcp_from, int_hdcp, game } = await request.json()    
    const toCheck: hdcpToCheck = {
      div_id,
      hdcp_from,
      int_hdcp,
      game
    }

    const errCode = validateHdcp(toCheck);
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
    
    const hdcp = await prisma.hdcp.create({
      data: {
        div_id,
        hdcp_from,
        int_hdcp,
        game
      }
    })
    return new NextResponse(JSON.stringify(hdcp), { status: 201 })    
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
      { error: "error creating hdcp" },
      { status: errStatus }
    );        
  }
}