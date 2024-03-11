import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { validateDiv, divToCheck, validDivData } from "../validate";

// routes /api/divs/:id

// div_f30aea2c534f4cfe87f4315531cef8ef

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
    const div = await prisma.div.findUnique({
      where: {
        id: id
      }
    })
    // return NextResponse.json(div);
    return NextResponse.json({div}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting div" },
      { status: 500 }
    );        
  } 
}

// div_f30aea2c534f4cfe87f4315531cef8ef
// {
//   "event_id": "evt_cb97b73cb538418ab993fc867f860510",
//   "div_name": "Scratch",
//   "hdcp_per": 0,        
//   "sort_order": 1
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id)) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 400 }
      );        
    }

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
        
    const san_div_name = sanitize(div_name);    
    const updated = await prisma.div.update({
      where: {
        id: id
      },
      // remove data if not sent
      data: {        
        event_id: event_id,
        div_name: san_div_name,
        hdcp_per: hdcp_per,
        sort_order: sort_order
      }
    })
    return NextResponse.json({updated}, {status: 200});    
  } catch (err: any) {

    console.log('err: ', err)

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
      { error: "error updating div" },
      { status: errStatus }
    );        
  }
}

// div_f30aea2c534f4cfe87f4315531cef8ef
// {
//   "event_id": "evt_cb97b73cb538418ab993fc867f860510",
//   "div_name": "Scratch",
//   "hdcp_per": 0,        
//   "sort_order": 1
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id)) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 400 }
      );        
    }

    const { event_id, div_name, hdcp_per, sort_order } = await request.json()
    const toCheck: divToCheck = {
      event_id,
      div_name,
      hdcp_per,      
      sort_order
    }
    if (validDivData(toCheck) !== ErrorCode.None) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

    const san_div_name = sanitize(div_name);
    const p_hdcp_per = (typeof hdcp_per === 'number') ? hdcp_per : undefined;
    const p_sort_order = (typeof sort_order === 'number') ? sort_order : undefined;
    const updated = await prisma.div.update({
      where: {
        id: id
      },    
      data: {
        event_id: event_id || undefined,
        div_name: san_div_name || undefined,
        hdcp_per: p_hdcp_per,
        sort_order: p_sort_order
      }
    })
    return NextResponse.json({updated}, {status: 200});    
  } catch (err: any) {
    let errStatus: number    
    switch (err.code) {
      case 'P2003':
        errStatus = 422        
        break;    
      case 'P2025': // no matching div_id
        errStatus = 422        
        break;    
      default:
        errStatus = 500        
        break;
    }
    return NextResponse.json(
      { error: "error patching div" },
      { status: errStatus }
    );        
  }
}

// div_26230803eb454a6588476b64eab1963a

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

    const deleted = await prisma.div.delete({
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
      { error: "error deleting div" },
      { status: errStatus }
    );        
  }
}