import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// routes /api/bowls

export async function GET(request: NextRequest) {
  const bowls = await prisma.bowl.findMany({
    orderBy: {
      bowl_name: 'asc',
    }
  })
  return NextResponse.json({bowls}, {status: 200});
}

