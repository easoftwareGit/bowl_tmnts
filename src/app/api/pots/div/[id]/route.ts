import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidBtDbId } from "@/lib/validation";

// routes /api/pots/div/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // check if id is a valid div id
    if (!isValidBtDbId(id, "div")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const pots = await prisma.pot.findMany({
      where: {
        div_id: id,
      },
    });
    // no matching rows is ok
    return NextResponse.json({ pots }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "error getting pots for div" },
      { status: 500 }
    );
  }
}
