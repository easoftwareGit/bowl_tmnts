import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEvent, sanitizeEvent } from "@/app/api/events/validate";
import { ErrorCode, validPostId } from "@/lib/validation";
import { eventDataType, eventType } from "@/lib/types/types";
import { initEvent } from "@/lib/db/initVals";

// routes /api/events

export async function GET(request: NextRequest) {
  try {
    const gotEvents = await prisma.event.findMany({
      orderBy: [
        {
          tmnt_id: 'asc',
        }, 
        {
          sort_order: 'asc',
        }, 
      ]
    })    
    // add in lpox
    const events = gotEvents.map(gotEvent => ({
      ...gotEvent,
      lpox: gotEvent.entry_fee
    }))    
    return NextResponse.json({ events }, { status: 200 });    
  } catch (error: any) {
    return NextResponse.json(
      { error: "error getting events" },
      { status: 500 }
    );        
  }
}

export async function POST(request: Request) {
  try {
    const { id, tmnt_id, event_name, team_size, games, added_money,
      entry_fee, lineage, prize_fund, other, expenses, lpox, sort_order } = await request.json()    
    const toCheck: eventType = {
      ...initEvent,
      tmnt_id,      
      event_name,
      team_size,
      games,
      added_money,
      entry_fee,
      lineage,
      prize_fund,
      other,
      expenses,    
      lpox,
      sort_order,
    }

    const toPost = sanitizeEvent(toCheck);
    const errCode = validateEvent(toPost);
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
      );
    }
    
    let postId = '';
    if (id) { 
      postId = validPostId(id, 'evt');
      if (!postId) {
        return NextResponse.json(
          { error: "invalid data" },
          { status: 422 }
        );
      }
    }    
        
    let eventData: eventDataType = {
      tmnt_id: toPost.tmnt_id,
      event_name: toPost.event_name,
      team_size: toPost.team_size,
      games: toPost.games,
      entry_fee: toPost.entry_fee,
      lineage: toPost.lineage,
      prize_fund: toPost.prize_fund,
      other: toPost.other,
      expenses: toPost.expenses,
      added_money: toPost.added_money,      
      sort_order: toPost.sort_order,          
    }
    if (postId) {
      eventData.id = postId
    }
    const postedEvent = await prisma.event.create({
      data: eventData
    })
    // add in lpox
    const event = {
      ...postedEvent,
      lpox: postedEvent.entry_fee
    }    
    return NextResponse.json({ event }, { status: 201 });    
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