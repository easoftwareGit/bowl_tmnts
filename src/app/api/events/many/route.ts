import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEvent, sanitizeEvent } from "@/app/api/events/validate";
import { ErrorCode, validPostId } from "@/lib/validation";
import { eventType } from "@/lib/types/types";
import { initEvent } from "@/lib/db/initVals";

// routes /api/events

export async function POST(request: NextRequest) { 
  try {
    
  } catch (err: any) {
    let errStatus: number
    switch (err.code) {
      case 'P2002': // Unique constraint
        errStatus = 404 
        break;
      case 'P2003': // parent not found
        errStatus = 404
        break;    
      default:
        errStatus = 500
        break;
    }
    return NextResponse.json(
      { error: "error creating event" },
      { status: errStatus }
    );        
  }
}