import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/brkts/squad/:squadId

export async function GET(
  request: Request,
  { params }: { params: { squadId: string } }
) {
  try {
    const squadId = params.squadId;
    // check if id is a valid squad id
    if (!isValidBtDbId(squadId, "sqd")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const gotBrkts = await prisma.brkt.findMany({
      where: {
        squad_id: squadId,
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

export async function DELETE(
  request: Request,
  { params }: { params: { squadId: string } }
) {
  try {
    const squadId = params.squadId;
    // check if squadId is a valid squad id
    if (!isValidBtDbId(squadId, "sqd")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const deleted = await prisma.brkt.deleteMany({
      where: {
        squad_id: squadId,
      },
    });
    return NextResponse.json({ deleted }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "error deleting brkts for squad" },
      { status: 500 }   
    );
  }
}