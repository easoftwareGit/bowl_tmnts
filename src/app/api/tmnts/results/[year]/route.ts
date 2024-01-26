import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// routes /api/tmnts/results/year

const validYear = (year: string): boolean => {

  if (!year || year.length !== 4) return false;
  const yearNum = parseInt(year, 10) || 0;  
  if (yearNum < 1900 || yearNum > 2100) return false;
  return true;
}

export async function GET(
  request: NextRequest, 
  { params }: {params: { year: string}}
) {
  const paramYear = params.year;
  if (!validYear(paramYear)) {
    return NextResponse.json({ error: 'Invalid parameter' }, { status: 400 });
  }
  
  const today = new Date((new Date()).toLocaleDateString())
  const todayYear = today.getFullYear();
  let maxDate: Date
  if (todayYear === parseInt(paramYear)) {
    maxDate = today;
  } else {
    maxDate = new Date(`${paramYear}-12-31`)
  }
  const jan1st = new Date(`${paramYear}-01-01`)
    
  const skip = request.nextUrl.searchParams.get('skip')
  const take = request.nextUrl.searchParams.get('take')
  const tmntData = await prisma.tmnt.findMany({
    where: {
      start_date: {
        lte: maxDate,
        gte: jan1st
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
  // return NextResponse.json(tmnts);

  return NextResponse.json({ tmntData }, { status: 200 });
}