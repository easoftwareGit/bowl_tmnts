import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/brkts/squad/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // check if id is a valid div id
    if (!isValidBtDbId(id, "sqd")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const gotBrkts = await prisma.brkt.findMany({
      where: {
        squad_id: id,
      },
      orderBy:{
        sort_order: 'asc',
      }, 
    });
    // add in fsa
    const brkts = gotBrkts.map((gotBrkt) => ({
      ...gotBrkt,
      fsa: (Number(gotBrkt.fee) * gotBrkt.players) + "",
    }));

    // no matching rows is ok
    return NextResponse.json({ brkts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting brkts for squad" },
      { status: 500 }
    );
  }
}
