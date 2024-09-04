import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ErrorCode, isValidBtDbId } from "@/lib/validation";
import { sanitizeTmnt, validateTmnt } from "@/app/api/tmnts/valildate";
import { tmntType } from "@/lib/types/types";
import { initTmnt } from "@/lib/db/initVals";
import { findTmntById } from "@/lib/db/tmnts/tmnts";

// routes /api/tmnts/:id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!isValidBtDbId(id, "tmt")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const tmnt = await prisma.tmnt.findUnique({
      where: {
        id: id,
      },
    });
    if (!tmnt) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ tmnt }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "error getting tmnt" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!isValidBtDbId(id, "tmt")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const { tmnt_name, start_date, end_date, user_id, bowl_id } =
      await request.json();
    const toCheck: tmntType = {
      ...initTmnt,
      tmnt_name,
      start_date,
      end_date,
      user_id,
      bowl_id,
    };

    const toPut: tmntType = sanitizeTmnt(toCheck);
    const errCode = validateTmnt(toPut);
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
    
    const tmnt = await prisma.tmnt.update({
      where: {
        id: id,
      },
      data: {
        tmnt_name: toPut.tmnt_name,
        start_date: toPut.start_date,
        end_date: toPut.end_date,
        // user_id: toPut.user_id, // not allowed to update user_id
        bowl_id: toPut.bowl_id,
      },
    });
    return NextResponse.json({ tmnt }, { status: 200 });
  } catch (error: any) {
    let errStatus: number;
    switch (error.code) {
      case "P2003":   // parent not found
        errStatus = 404;
        break;
      case "P2025":   // record not found
        errStatus = 404;
        break;
      default:
        errStatus = 500;
        break;
    }
    return NextResponse.json(
      { error: "Error putting bowl" },
      { status: errStatus }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!isValidBtDbId(id, "tmt")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const json = await request.json();
    // populate toCheck with json
    const jsonProps = Object.getOwnPropertyNames(json);

    const currentTmnt = await findTmntById(id);
    if (!currentTmnt) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const toCheck: tmntType = {
      ...initTmnt,
      tmnt_name: currentTmnt.tmnt_name,
      start_date: currentTmnt.start_date,
      end_date: currentTmnt.end_date,
      user_id: currentTmnt.user_id,
      bowl_id: currentTmnt.bowl_id,
    };

    if (jsonProps.includes("tmnt_name")) {
      toCheck.tmnt_name = json.tmnt_name;
    }
    if (jsonProps.includes("start_date")) {
      toCheck.start_date = json.start_date;
    }
    if (jsonProps.includes("end_date")) {
      toCheck.end_date = json.end_date;
    }
    if (jsonProps.includes("bowl_id")) {      
      toCheck.bowl_id = json.bowl_id;
    }
    if (jsonProps.includes("user_id")) {
      toCheck.user_id = json.user_id;
    }

    const toBePatched = sanitizeTmnt(toCheck);
    const errCode = validateTmnt(toBePatched);
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode as ErrorCode) {
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
    
    const toPatch = {
      tmnt_name: "",
      start_date: null as Date | null,
      end_date: null as Date | null,
      bowl_id: "",
      user_id: "",
    };
    let gotEmptyStartDate = undefined;
    let gotEmptyEndDate = undefined;
    if (jsonProps.includes("tmnt_name")) {
      toPatch.tmnt_name = toBePatched.tmnt_name;
    }
    if (jsonProps.includes("start_date")) {
      toPatch.start_date = toBePatched.start_date;
      gotEmptyStartDate = '';
    }
    if (jsonProps.includes("end_date")) {
      toPatch.end_date = toBePatched.end_date;
      gotEmptyEndDate = '';
    }
    if (jsonProps.includes("bowl_id")) {
      toPatch.bowl_id = toBePatched.bowl_id;
    }
    if (jsonProps.includes("user_id")) {
      toPatch.user_id = toBePatched.user_id;
    }

    const tmnt = await prisma.tmnt.update({
      where: {
        id: id,
      },
      // remove data if not sent
      data: {
        tmnt_name: toPatch.tmnt_name || undefined,
        start_date: toPatch.start_date || gotEmptyStartDate,
        end_date: toPatch.end_date || gotEmptyEndDate,
        bowl_id: toPatch.bowl_id || undefined,
        // user_id: toPatch.user_id || undefined, // do not patch user_id
      },
    });
    return NextResponse.json({ tmnt }, { status: 200 });
  } catch (error: any) {
    let errStatus: number;
    switch (error.code) {
      case "P2003":   // parent not found
        errStatus = 404;
        break;
      case "P2025":   // record not found
        errStatus = 404;
        break;
      default:
        errStatus = 500;
        break;
    }
    return NextResponse.json(
      { error: "Error pasting tmnt" },
      { status: errStatus }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!isValidBtDbId(id, "tmt")) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const deleted = await prisma.tmnt.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ deleted }, { status: 200 });
  } catch (err: any) {
    let errStatus: number;
    switch (err.code) {
      case "P2003": // parent has child rows
        errStatus = 409;
        break;
      case "P2025": // record not found
        errStatus = 404;
        break;
      default:
        errStatus = 500;
        break;
    }
    return NextResponse.json(
      { error: "error deleting tmnt" },
      { status: errStatus }
    );
  }
}