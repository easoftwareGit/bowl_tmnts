import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBrkt, sanitizeBrkt } from "./validate";
import { ErrorCode } from "@/lib/validation";
import { brktType } from "@/lib/types/types";
import { initBrkt } from "@/lib/db/initVals";

// routes /api/brkts

export async function GET(request: NextRequest) {
  try {
    const gotBrkts = await prisma.brkt.findMany({
      orderBy: [
        {
          div_id: "asc",
        },
        {
          sort_order: "asc",
        },
      ],
    });
    // add in fsa
    const brkts = gotBrkts.map((gotBrkt) => ({
      ...gotBrkt,
      fsa: (Number(gotBrkt.fee) * gotBrkt.players) + "",
    }));
    return NextResponse.json({ brkts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "error getting brkts" }, { status: 500 });
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
      players,
      first,
      second,
      admin,
      fsa,
      sort_order,
    } = await request.json();
    const toCheck: brktType = {
      ...initBrkt,
      id,
      div_id,
      squad_id,
      fee,
      start,
      games,
      players,
      first,
      second,
      admin,
      fsa,
      sort_order,
    };

    const toPost = sanitizeBrkt(toCheck);
    const errCode = validateBrkt(toPost);
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
    
    // NO fsa in eventDataType
    type brktDataType = {
      div_id: string;
      squad_id: string;
      fee: string;
      start: number;
      games: number;
      players: number;
      first: string;
      second: string;
      admin: string;
      sort_order: number;
      id?: string;
    };
    let brktData: brktDataType = {
      id: toPost.id,
      div_id: toPost.div_id,
      squad_id: toPost.squad_id,
      fee: toPost.fee,
      start: toPost.start,
      games: toPost.games,
      players: toPost.players,
      first: toPost.first,
      second: toPost.second,
      admin: toPost.admin,
      sort_order: toPost.sort_order,
    };
    const postedBrkt = await prisma.brkt.create({
      data: brktData,
    });
    // add in fsa
    const brkt = {
      ...postedBrkt,
      fsa: (Number(postedBrkt.fee) * postedBrkt.players) + "",
    };
    return NextResponse.json({ brkt }, { status: 201 });
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
      { error: "error creating brkt" },
      { status: errStatus }
    );
  }
}
