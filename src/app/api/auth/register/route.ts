import { findUserByEmail } from "@/lib/db/users";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import {
  maxFirstNameLength,
  maxLastNameLength,
  maxEmailLength,  
  isEmail,
  isPassword8to20,
} from "@/lib/validation";
import { sanitize } from "@/lib/sanitize";
import { phone as phoneChecking } from "phone";

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, phone, password } = await req.json();
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "missing data" },
        { status: 422 }
      );
    }

    const san_first_name = sanitize(first_name)
    const san_last_name = sanitize(last_name)
    const phoneCheck = phoneChecking(phone);
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

    const user = await prisma.user.create({
      data: {
        first_name: san_first_name,
        last_name: san_last_name,
        email,
        phone: phoneCheck.phoneNumber,
        password: hashed,
      },
    });

    return NextResponse.json({
      user: {
        email: user.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });    
  }
}
