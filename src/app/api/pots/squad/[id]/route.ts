import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/pots/squad/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // check if id is a valid squad id
    if (!isValidBtDbId(id, "sqd")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const pots = await prisma.pot.findMany({
      where: {
        squad_id: id,
      },
    });
    // no matching rows is ok
    return NextResponse.json({ pots }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting pots for squad" },
      { status: 500 }
    );
  }
}
