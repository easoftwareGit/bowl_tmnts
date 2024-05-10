import { findUserByEmail } from "@/lib/db/users";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { ErrorCode } from "@/lib/validation";
import { userType } from "@/lib/types/types";
import { initUser } from "@/db/initVals";
import { sanitizeUser, validateUser } from "../../users/validate";

export async function POST(req: Request) {
  try {        
    const { first_name, last_name, email, phone, password } = await req.json();
    const postUser: userType = {
      ...initUser,
      first_name,
      last_name,
      email,
      phone,
      password,
    }
    const sanitizedUser: userType = sanitizeUser(postUser);          
    const errCode = validateUser(sanitizedUser, true);
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

    // if got here, email is valid, ok to pass to findUserByEmail
    const oldUser = await findUserByEmail(email);
    if (oldUser) {
      return NextResponse.json(
        { error: "email already in use" },
        { status: 409 }
      );
    }

    const saltRoundsStr: any = process.env.SALT_ROUNDS;
    const saltRounds = parseInt(saltRoundsStr);
    const hashedpassword = await hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        first_name: sanitizedUser.first_name,
        last_name: sanitizedUser.last_name,
        email,
        phone: sanitizedUser.phone,
        password_hash: hashedpassword,
      },
    });
    return NextResponse.json({user}, {status: 201});    
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );    
  }
}
