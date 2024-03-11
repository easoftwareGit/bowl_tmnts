import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { validateFeat, featToCheck } from "./validate";
import { ErrorCode } from "@/lib/validation";

// routes /api/feats

export async function GET(request: NextRequest) {
  try {
    const feats = await prisma.feat.findMany({
      orderBy: [
        {
          sort_order: 'asc',
        }, 
      ]
    })
    return NextResponse.json({feats}, {status: 200});
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting features" },
      { status: 500 }
    );        
  }
}

// {
//   "feat_name": "Super Senior",
//   "entry_type": "single",
//   "sort_order": 6,
// }

export async function POST(request: Request) {
  try {
    const { feat_name, entry_type, sort_order } = await request.json()    
    const toCheck: featToCheck = {
      feat_name,
      entry_type,
      sort_order
    }

    const errCode = validateFeat(toCheck);
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

    const san_feat_name = sanitize(feat_name);
    const feat = await prisma.feat.create({
      data: {        
        feat_name: san_feat_name,
        entry_type,        
        sort_order
      }
    })
    return new NextResponse(JSON.stringify(feat), { status: 201 })    
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
      { error: "error creating feature" },
      { status: errStatus }
    );        
  }
}