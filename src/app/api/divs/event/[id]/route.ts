import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/divs/event/:id

// evt_dadfd0e9c11a4aacb87084f1609a0afd

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
    const divs = await prisma.div.findMany({
      where: {
        event_id: id
      }
    })    
    if (!divs || divs.length === 0) {
      return NextResponse.json(
        { error: "no divs for event found" },
        { status: 404 }
      );          
    }
    return NextResponse.json({divs}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting divs for event" },
      { status: 500 }
    );        
  } 
}
