import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDiv, sanitizeDiv } from "./validate";
import { ErrorCode, validPostId } from "@/lib/validation";
import { divType, HdcpForTypes } from "@/lib/types/types";
import { initDiv } from "@/lib/db/initVals";

// routes /api/divs

export async function GET(request: NextRequest) {
  try {
    const gotDivs = await prisma.div.findMany({
      orderBy: [
        {
          tmnt_id: "asc",
        },
        {
          sort_order: "asc",
        },
      ],
    });
    const divs = gotDivs.map((gotDiv) => ({
      ...gotDiv,
      hdcp_per_str: (gotDiv.hdcp_per * 100).toFixed(2),
    }));
    return NextResponse.json({ divs }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "error getting divs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, tmnt_id, div_name, hdcp_per, hdcp_from, int_hdcp, hdcp_for, sort_order } =
      await request.json();
    const toCheck: divType = {
      ...initDiv,
      tmnt_id,
      div_name,
      hdcp_per,
      hdcp_from,
      int_hdcp,
      hdcp_for,
      sort_order,
    };

    const errCode = validateDiv(toCheck);
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode) {
        case ErrorCode.MissingData:
          errMsg = "missing data";
          break;
        case ErrorCode.MissingData:
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
      postId = validPostId(id, "div");
      if (!postId) {
        return NextResponse.json({ error: "invalid post id" }, { status: 422 });
      }
    }

    const toPost = sanitizeDiv(toCheck);
    type divDataType = {
      tmnt_id: string;
      div_name: string;
      hdcp_per: number;
      hdcp_from: number;
      int_hdcp: boolean;
      hdcp_for: HdcpForTypes;
      sort_order: number;
      id?: string;
    };
    let divData: divDataType = {
      tmnt_id: toPost.tmnt_id,
      div_name: toPost.div_name,
      hdcp_per: toPost.hdcp_per,
      hdcp_from: toPost.hdcp_from,
      int_hdcp: toPost.int_hdcp,
      hdcp_for: toPost.hdcp_for,
      sort_order: toPost.sort_order,
    };
    if (postId) {
      divData.id = postId;
    }
    const div = await prisma.div.create({
      data: divData,
    });

    return NextResponse.json({ div }, { status: 201 });
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
    return NextResponse.json({ error: "error creating div" }, { status: errStatus });
  }
}
