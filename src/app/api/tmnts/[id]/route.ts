import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// /tmt_9a34a65584f94f548f5ce3b3becbca19

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   
  const id = params.id;
  const tmnt = await prisma.tmnt.findUnique({
    where: {
      id: id
    }
  })
  // return NextResponse.json(tmnt);
  return NextResponse.json({tmnt}, {status: 200});
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const json = await request.json()

  const tmnt = await prisma.tmnt.update({
    where: {
      id: id
    },
    // remove data if not sent
    data: {
      end_date: json.end_date || null
    }
  })
  return NextResponse.json({tmnt}, {status: 200});
}

export async function PATCH(request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const json = await request.json()

  const updated = await prisma.tmnt.update({
    where: {
      id: id
    },    
    data: json
  })
  return NextResponse.json({updated}, {status: 200});
}

export async function DELETE(request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const deleted = await prisma.tmnt.delete({
    where: {
      id: id
    }
  })

  return NextResponse.json({deleted}, {status: 200});
}