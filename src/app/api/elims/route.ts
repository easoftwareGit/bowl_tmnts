import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateElim, sanitizeElim } from "./validate";
import { ErrorCode, validPostId } from "@/lib/validation";
import { elimType } from "@/lib/types/types";
import { initElim } from "@/lib/db/initVals";

// routes /api/elims

export async function GET(request: NextRequest) {
  try {
    const elims = await prisma.elim.findMany({
      orderBy: [
        {
          div_id: "asc",
        },
        {
          sort_order: "asc",
        },
      ],
    });
    return NextResponse.json({ elims }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "error getting elims" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      id,
      div_id,
      squad_id,
      fee,
      start,
      games,
      sort_order,
    } = await request.json();
    
    const toCheck: elimType = {
      ...initElim,
      div_id,
      squad_id,
      fee,
      start,
      games,
      sort_order,
    };

    const toPost = sanitizeElim(toCheck);
    const errCode = validateElim(toPost);
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode) {
        case ErrorCode.MissingData:
          errMsg = "missing data";
          break;
        case ErrorCode.InvalidData:
          errMsg = "invalid data";
          break;
        default:
          errMsg = "unknown error";
          break;
      }
      return NextResponse.json({ error: errMsg }, { status: 422 });
    }

    let postId = "";
    if (id) {
      postId = validPostId(id, "elm");
      if (!postId) {
        return NextResponse.json({ error: "invalid data" }, { status: 422 });
      }
    }
    
    type elimDataType = {
      div_id: string;
      squad_id: string;
      fee: string;
      start: number;
      games: number;
      sort_order: number;
      id?: string;
    };
    let elimData: elimDataType = {
      div_id: toPost.div_id, 
      squad_id: toPost.squad_id,
      fee: toPost.fee,
      start: toPost.start,
      games: toPost.games,
      sort_order: toPost.sort_order,
    };
    if (postId) {
      elimData.id = postId;
    }
    const elim = await prisma.elim.create({
      data: elimData,
    });
    return NextResponse.json({ elim }, { status: 201 });
  } catch (err: any) {
    let errStatus: number;
    switch (err.code) {
      case "P2002": // Unique constraint
        errStatus = 422;
        break;
      case "P2003": // Foreign key constraint
        errStatus = 422;
        break;
      default:
        errStatus = 500;
        break;
    }
    return NextResponse.json(
      { error: "error creating elim" },
      { status: errStatus }
    );
  }
}
