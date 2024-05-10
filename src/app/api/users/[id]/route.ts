import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userType } from "@/lib/types/types";
import { initUser } from "@/db/initVals";
import { sanitizeUser, validateUser, validUserEmail, validUserFirstName, validUserLastName, validUserPassword, validUserPhone } from "../validate";
import { ErrorCode } from "@/lib/validation";
import { hash } from "bcrypt";

// usr_5bcefb5d314fff1ff5da6521a2fa7bde

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {   
  try {
    const id = params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })  
    return NextResponse.json({user}, {status: 200});    
  } catch (error) {
    return NextResponse.json(
      { error: "Error getting user" },
      { status: 500 }
    );    
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    // const json = await req.json()
    const { first_name, last_name, email, phone, password } = await req.json();

    const toCheck: userType = {
      ...initUser,
      first_name,
      last_name,
      email,
      phone,
      password,
    }

    const errCode = validateUser(toCheck, false);
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode) {
        case ErrorCode.MissingData:
          errMsg = 'missing data'
          break;
        case ErrorCode.InvalidData:
          errMsg = 'invalid data'
          break;
        default:
          errMsg = 'unknown error'
          break;        
      }
      return NextResponse.json(
        { error: errMsg },
        { status: 422 }
      )
    }

    const toPut = sanitizeUser(toCheck);  

    const saltRoundsStr: any = process.env.SALT_ROUNDS;
    const saltRounds = parseInt(saltRoundsStr);
    const hashedPassword = await hash(toPut.password, saltRounds);    

    const user = await prisma.user.update({
      where: {
        id: id
      },      
      data: {
        first_name: toPut.first_name,
        last_name: toPut.last_name,
        email: toPut.email,
        password_hash: hashedPassword,
        phone: toPut.phone
      }
    })
    return NextResponse.json({user}, {status: 200});    
  } catch (error: any) {
    let errStatus: number  
    switch (error.code) {      
      case 'P2025':
        errStatus = 404  
        break;      
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "Error putting user" },
      { status: errStatus }
    );        
  }
}

export async function PATCH(request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const json = await request.json()

    // populate toCheck with json
    const jsonProps = Object.getOwnPropertyNames(json);
    const toCheck: userType = {
      ...initUser,
    }
    let errCode = ErrorCode.None;
    if (jsonProps.includes('first_name')) {      
      if (!validUserFirstName(json.first_name)) {
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.first_name = json.first_name
      }    
    }
    if (jsonProps.includes('last_name')) {
      if (!validUserLastName(json.last_name)) { 
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.last_name = json.last_name
      }     
    }
    if (jsonProps.includes('email')) {
      if (!validUserEmail(json.email)) {
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.email = json.email
      }
    }
    if (jsonProps.includes('phone')) {
      if (!validUserPhone(json.phone)) {
        errCode = ErrorCode.InvalidData   
      } else {
        toCheck.phone = json.phone
      }
    }

    let hashedPassword = '';
    if (jsonProps.includes('password')) {
      if (!validUserPassword(json.password)) {
        errCode = ErrorCode.InvalidData
      } else {
        toCheck.password = json.password
        const saltRoundsStr: any = process.env.SALT_ROUNDS;
        const saltRounds = parseInt(saltRoundsStr);
        hashedPassword = await hash(toCheck.password, saltRounds);
      }
    }
    if (errCode !== ErrorCode.None) {
      let errMsg: string;
      switch (errCode as ErrorCode) {
        case ErrorCode.MissingData:
          errMsg = 'missing data'
          break;
        case ErrorCode.InvalidData:
          errMsg = 'invalid data'
          break;
        default:
          errMsg = 'unknown error'
          break;        
      }
      return NextResponse.json(
        { error: errMsg },
        { status: 422 }
      )
    }

    const toPatch = sanitizeUser(toCheck);    
    const user = await prisma.user.update({
      where: {
        id: id
      },
      // remove data if not sent
      data: {
        first_name: toPatch.first_name || undefined,
        last_name: toPatch.last_name || undefined,
        email: toPatch.email || undefined,
        password_hash: hashedPassword || undefined,
        phone: toPatch.phone || undefined
      }
    })
    return NextResponse.json({user}, {status: 200});    
  } catch (error: any) {
    let errStatus: number  
    switch (error.code) {      
      case 'P2003':
        errStatus = 422
        break;
      case 'P2025':
        errStatus = 404  
        break;      
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "Error pasting user" },
      { status: errStatus }
    );            
  }
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