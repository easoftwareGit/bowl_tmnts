import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { validateHdcp, hdcpToCheck, validHdcpData } from "../validate";

// routes /api/hdcps/:id

// hdc_67c7a51bbd2d441da9bb20a3001795a9

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   

  try {
    const id = params.id;
    if (!isValidBtDbId(id, 'hdc')) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );        
    }
    const hdcp = await prisma.hdcp.findUnique({
      where: {
        id: id
      }
    })
    // return NextResponse.json(hdcp);
    return NextResponse.json({ hdcp}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting hdcp" },
      { status: 500 }
    );        
  } 
}

// hdc_d97abb6a776f4ab289d9e913ea7ada46
// {
//   "div_id": "div_fe72ab97edf8407186c8e6df7f7fb741",
//   "hdcp_from": 225,
//   "int_hdcp": false,
//   "game": false
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id, 'hdc')) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );        
    }

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

    const updated = await prisma.hdcp.update({
      where: {
        id: id
      },      
      data: {
        div_id,
        hdcp_from,
        int_hdcp,
        game
      }
    })
    return NextResponse.json({updated}, {status: 200});    
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
      { error: "error updating event" },
      { status: errStatus }
    );        
  }
}

// hdc_d97abb6a776f4ab289d9e913ea7ada46
// {
//   "div_id": "div_fe72ab97edf8407186c8e6df7f7fb741",
//   "hdcp_from": 225,
//   "int_hdcp": false,
//   "game": false
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id    
    if (!isValidBtDbId(id, 'hdc')) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );        
    }

    const { div_id, hdcp_from, int_hdcp, game } = await request.json()
    const toCheck: hdcpToCheck = {
      div_id,
      hdcp_from,
      int_hdcp,
      game
    }
    if (validHdcpData(toCheck) !== ErrorCode.None) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }
    
    const p_hdcp_from = (typeof hdcp_from === 'number') ? hdcp_from : undefined;
    const p_int_hdcp = (typeof int_hdcp === "boolean") ? int_hdcp : undefined;
    const p_game = (typeof game !== "boolean") ? game : undefined;    
    const updated = await prisma.hdcp.update({
      where: {
        id: id
      },    
      data: {
        div_id: div_id || undefined,
        hdcp_from: p_hdcp_from,
        int_hdcp: p_int_hdcp,
        game: p_game
      }
    })
    return NextResponse.json({updated}, {status: 200});    
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
      { error: "error patching hdcp" },
      { status: errStatus }
    );        
  }
}

// hdc_d97abb6a776f4ab289d9e913ea7ada46

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!isValidBtDbId(id, 'hdc')) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );        
    }

    const deleted = await prisma.hdcp.delete({
      where: {
        id: id
      }
    })
    return NextResponse.json({deleted}, {status: 200});    
  } catch (err: any) {
    let errStatus: number    

    console.log('err: ', err)

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
      { error: "error deleting hdcp" },
      { status: errStatus }
    );        
  }
}