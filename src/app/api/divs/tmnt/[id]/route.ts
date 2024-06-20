import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/divs/event/:id

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
    const gotDivs = await prisma.div.findMany({
      where: {
        tmnt_id: id
      }
    })    
    // no matching rows is ok

    // add in hdcp_per_str
    const divs = gotDivs.map(gotDiv => ({
      ...gotDiv,
      hdcp_per_str: (gotDiv.hdcp_per * 100).toFixed(2)
    }))
    return NextResponse.json({divs}, {status: 200});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting divs for event" },
      { status: 500 }
    );        
  } 
}
