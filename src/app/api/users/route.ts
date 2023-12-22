import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// routes /api/users

export async function GET(request: NextRequest) {
  const skip = request.nextUrl.searchParams.get('skip')
  const take = request.nextUrl.searchParams.get('take')
  const users = await prisma.user.findMany({
    skip: skip ? parseInt(skip, 10) : undefined,
    take: take ? parseInt(take, 10) : undefined,
  })
  // return NextResponse.json(users);
  return NextResponse.json({users}, {status: 200});
}

export async function POST(request: Request) {
  const json = await request.json()

  const created = await prisma.user.create({
    data: json
  })

  return new NextResponse(JSON.stringify(created), { status: 201 })
}