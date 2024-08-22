import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/lanes/squad/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   
  try {
    const id = params.id;
    if (!isValidBtDbId(id, 'sqd')) {
      return NextResponse.json(
        { error: "invalid request" },
        { status: 404 }
      );        
    }
    const lanes = await prisma.lane.findMany({
      where: {
        squad_id: id
      },
      orderBy: {
        lane_number: 'asc'
      }
    })    
    // no matching rows is ok
    return NextResponse.json({ lanes }, { status: 200 });        
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting lanes for squad" },
      { status: 500 }
    );        
  } 
}
