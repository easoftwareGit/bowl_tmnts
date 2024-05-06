import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize";
import { ErrorCode } from "@/lib/validation";

// routes /api/lanes

export async function GET(request: NextRequest) {
  const lanes = await prisma.lanes.findMany({
  })
  return NextResponse.json({data: lanes}, {status: 200});
}
