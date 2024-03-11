import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/hdcp/div/:id

// div_24b1cd5dee0542038a1244fc2978e862

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
    // one to one, so findOne, not findMany
    const hdcp = await prisma.hdcp.findUnique({
      where: {
        div_id: id
      }
    })    
    if (!hdcp) {
      return NextResponse.json(
        { error: "no hdcp for div found" },
        { status: 404 }
      );          
    }
    return NextResponse.json({hdcp}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting hdcp for div" },
      { status: 500 }
    );        
  } 
}
