import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/events/tmnt/:id

// tmt_fd99387c33d9c78aba290286576ddce5

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
    const events = await prisma.event.findMany({
      where: {
        tmnt_id: id
      }
    })    
    if (!events || events.length === 0) {
      return NextResponse.json(
        { error: "no events for tmnt found" },
        { status: 404 }
      );          
    }
    return NextResponse.json({events}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting events for tmnt" },
      { status: 500 }
    );        
  } 
}
