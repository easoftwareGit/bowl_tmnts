import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/events/tmnt/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   
  try {
    const id = params.id;
    // check if id is a valid tmnt id
    if (!isValidBtDbId(id, 'tmt')) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );        
    }
    const gotEvents = await prisma.event.findMany({
      where: {
        tmnt_id: id
      },
      orderBy: {
        sort_order: 'asc'
      }
    })    
    // no matching rows is ok

    // add in lpox
    const events = gotEvents.map(gotEvent => ({
      ...gotEvent,
      lpox: gotEvent.entry_fee
    }))
    return NextResponse.json({events}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting events for tmnt" },
      { status: 500 }
    );        
  } 
}
