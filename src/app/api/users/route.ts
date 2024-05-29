import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { sanitize } from "@/lib/sanitize";
import { phone as phoneChecking } from "phone";
import {
  maxFirstNameLength,
  maxLastNameLength,
  maxEmailLength,  
  isEmail,
  isPassword8to20,
  isValidBtDbId,
} from "@/lib/validation";
import { findUserByEmail } from "@/lib/db/users";
import { validPostUserId } from "./validate";

// routes /api/users

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({})
  return NextResponse.json({users}, {status: 200});
}

export async function POST(request: Request) {
  
  // use route api/register  
  try {
    const { id, first_name, last_name, email, phone, password } = await request.json();
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "missing data" },
        { status: 422 }
      );
    }
    const san_first_name = sanitize(first_name)
    const san_last_name = sanitize(last_name)
    const phoneCheck = phoneChecking(phone);
    let postId = '';
    if (id) { 
      postId = validPostUserId(id);
      if (!postId) {
        return NextResponse.json(
          { error: "invalid id data" },
          { status: 422 }
        );
      }
    }    
    // no need to check for phone.length, because
    // phoneCheck.isValid will be false if length too long
    if (san_first_name.length > maxFirstNameLength || 
        san_last_name.length > maxLastNameLength ||
        !isEmail(email) || email.length > maxEmailLength ||      
        !phoneCheck.isValid ||
        !isPassword8to20(password)) {
      return NextResponse.json(
        { error: "invalid data" },
        { status: 422 }
      );        
    }    

    const oldUser = await findUserByEmail(email);
    if (oldUser) {
      return NextResponse.json(
        { error: "email already in use" },
        { status: 409 }
      );
    }

    const saltRoundsStr: any = process.env.SALT_ROUNDS;
    const saltRounds = parseInt(saltRoundsStr);
    const hashed = await hash(password, saltRounds);

    type userDataType = {
      first_name: string,
      last_name: string,
      email: string,
      phone: string,
      password_hash: string,
      id?: string;
    }
    let userData: userDataType = {
      first_name: san_first_name,
      last_name: san_last_name,
      email,
      phone: phoneCheck.phoneNumber,
      password_hash: hashed,
    }
    if (postId) {
      userData = {
        ...userData,
        id: postId
      }
    }

    const user = await prisma.user.create({
      data: userData,
      // data: {        
      //   first_name: san_first_name,
      //   last_name: san_last_name,
      //   email,
      //   phone: phoneCheck.phoneNumber,
      //   password_hash: hashed,
      // },
    });
    return NextResponse.json(
      { user: user },
      { status: 201 }
    );    
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );    
  }
}