import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { endOfToday } from "date-fns";

// routes /api/tmnts/results

export async function GET(request: NextRequest) {
  
  const skip = request.nextUrl.searchParams.get("skip");
  const take = request.nextUrl.searchParams.get("take");
  
  const tmntData = await prisma.tmnt.findMany({
    where: {
      start_date: {
        lte: endOfToday(),
      },
    },
    orderBy: [
      {
        start_date: 'desc'
      }
    ],
    select: {
      id: true,
      tmnt_name: true,
      start_date: true,
      bowls: {
        select: {
          bowl_name: true,
          city: true,
          state: true,
          url: true,
        },
      },
    },
    skip: skip ? parseInt(skip, 10) : undefined,
    take: take ? parseInt(take, 10) : undefined,
  });
  // return NextResponse.json(resultsData);

  return NextResponse.json({ data: tmntData }, { status: 200 });
}
