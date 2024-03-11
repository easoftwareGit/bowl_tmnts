import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { validateFeat, featToCheck, validFeatData } from "../validate";

// routes /api/feats/:id

// fea_a04f798e8c70473a98fb3e4487635046

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
    const feat = await prisma.feat.findUnique({
      where: {
        id: id
      }
    })
    // return NextResponse.json(feat);
    return NextResponse.json({feat}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting feature" },
      { status: 500 }
    );        
  } 
}

// fea_ade90b4eb8494ffd9d56964a22ba4720
// {  
//   "feat_name": "Senior Insurance",
//   "entry_type": "single",
//   "sort_order": 5,
// }

export async function PUT(
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

    const { feat_name, entry_type, sort_order } = await request.json()    
    const toCheck: featToCheck = {
      feat_name: feat_name,
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
    const updated = await prisma.feat.update({
      where: {
        id: id
      },      
      data: {        
        feat_name: san_feat_name,        
        entry_type,
        sort_order,
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
      { error: "error updating feature" },
      { status: errStatus }
    );        
  }
}

// change any 1..N of the values in the object, pass onnly changed value(s)
// fea_ade90b4eb8494ffd9d56964a22ba4720
// {  
//   "feat_name": "Senior Insurance",
//   "entry_type": "single",
//   "sort_order": 5,
// }

export async function PATCH(
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

    const { feature_name, entry_type, sort_order } = await request.json()    
    const toCheck: featToCheck = {
      feat_name: feature_name,
      entry_type,
      sort_order
    }
    if (validFeatData(toCheck) !== ErrorCode.None) {
      return NextResponse.json(
        { error: 'invalid data' },
        { status: 422 }
      );
    }

    const san_feature_name = sanitize(feature_name);
    const p_entry_type = (typeof entry_type === 'string') ? entry_type : undefined;
    const p_sort_order = (typeof sort_order === 'number') ? sort_order : undefined;
    const updated = await prisma.feat.update({
      where: {
        id: id
      },    
      data: {
        feat_name: san_feature_name || undefined,        
        entry_type: p_entry_type,
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
      default:
        errStatus = 500        
        break;
    }
    return NextResponse.json(
      { error: "error patching feature" },
      { status: errStatus }
    );        
  }
}

// fea_ade90b4eb8494ffd9d56964a22ba4720

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

    const deleted = await prisma.feat.delete({
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
      { error: "error deleting feature" },
      { status: errStatus }
    );        
  }
}