import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// routes /api/bowls

export async function GET(request: NextRequest) {
  const bowls = await prisma.bowl.findMany({
    orderBy: {
      bowl_name: 'asc',
    }
  })
  return NextResponse.json({data: bowls}, {status: 200});
}

export async function POST(request: NextRequest) {
  // only admin and super admins can create new bowls
  const {bowl_name, city, state } = await request.json();

}