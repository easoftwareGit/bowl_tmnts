import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// /usr_5bcefb5d314fff1ff5da6521a2fa7bde

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   
  const id = params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  // return NextResponse.json(user);
  return NextResponse.json({user}, {status: 200});
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const json = await request.json()

  const user = await prisma.user.update({
    where: {
      id: id
    },
    // remove data if not sent
    data: {
      first_name: json.first_name || null,
      last_name: json.last_name || null,
      password_hash: json.password_hash || null,
      phone: json.phone || null
    }
  })
  return NextResponse.json({user}, {status: 200});
}

export async function PATCH(request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const json = await request.json()

  const updated = await prisma.user.update({
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

  const deleted = await prisma.user.delete({
    where: {
      id: id
    }
  })

  return NextResponse.json({deleted}, {status: 200});
}