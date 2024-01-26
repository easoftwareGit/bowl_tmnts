import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validYear } from "../../valid";
import { Prisma } from "@prisma/client";

// routes /api/tmnts/years/year

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {

  const paramYear = params.year;
  if (!validYear(paramYear)) {
    return NextResponse.json({ error: 'Invalid parameter' }, { status: 400 });
  }
  
  const lastDOY = new Date(`${paramYear}-12-31`)

  // ok to use queryRawUnsafe because call to validYear 
  const yearsData = await prisma.$queryRawUnsafe(
    `SELECT DISTINCT extract(year from start_date) AS "year"
    FROM "Tmnt"
    WHERE start_date <= $1
    ORDER BY "year" DESC;`,
    lastDOY
  )
    
  return NextResponse.json({ yearsData }, { status: 200 });
}
