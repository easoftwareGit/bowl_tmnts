import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/squads/event/:id

// evt_cb97b73cb538418ab993fc867f860510

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
    if (!squads || squads.length === 0) {
      return NextResponse.json(
        { error: "no squads for event found" },
        { status: 404 }
      );          
    }
    return NextResponse.json({squads}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting squads for event" },
      { status: 500 }
    );        
  } 
}
