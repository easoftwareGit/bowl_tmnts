import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/squads/event/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   
  try {
    const id = params.id;
    if (!isValidBtDbId(id, 'evt')) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 404 }
      );        
    }
    const squads = await prisma.squad.findMany({
      where: {
        event_id: id
      }
    })    
    // no matching rows is ok
    return NextResponse.json({squads}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting squads for event" },
      { status: 500 }
    );        
  } 
}
