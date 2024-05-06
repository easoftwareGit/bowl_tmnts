import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { validateDiv, divToCheck } from "./validate";
import { ErrorCode } from "@/lib/validation";

// routes /api/divs

export async function GET(request: NextRequest) {
  try {
    const divs = await prisma.div.findMany({
      orderBy: [
        {
          event_id: 'asc',
        }, 
        {
          sort_order: 'asc',
        }, 
      ]
    })
    return NextResponse.json({divs}, {status: 200});
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting divs" },
      { status: 500 }
    );        
  }
}

// {  
//   "event_id": "evt_cb97b73cb538418ab993fc867f860510",
//   "div_name": "Hdcp",
//   "hdcp_per": 90,        
//   "sort_order": 2
// }

export async function POST(request: Request) {
  try {
    const { event_id, div_name, hdcp_per, sort_order } = await request.json()    
    const toCheck: divToCheck = {
      event_id,
      div_name,
      hdcp_per,      
      sort_order
    }

    const errCode = validateDiv(toCheck);
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode) {
        case ErrorCode.MissingData:
          errMsg = 'missing data'
          break;
        case ErrorCode.MissingData:
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

    const san_div_name = sanitize(div_name);
    const div = await prisma.div.create({
      data: {        
        event_id,
        div_name: san_div_name,
        hdcp_per,        
        sort_order
      }
    })
    return new NextResponse(JSON.stringify(div), { status: 201 })    
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
      { error: "error creating event" },
      { status: errStatus }
    );        
  }
}
