import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "date-fns";

// routes /api/tmnts/upcoming

export async function GET(request: NextRequest) {
       
  const skip = request.nextUrl.searchParams.get('skip')
  const take = request.nextUrl.searchParams.get('take')
  const tmnts = await prisma.tmnt.findMany({
    where: {
      start_date: {
        gt: startOfToday()
      }
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
  })  

  return NextResponse.json({ tmnts }, { status: 200 });
}