import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// submit user responses to database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, name, email, votes } = body;

    await prisma.response.create({
      data: {
        eventId,
        name,
        email,
        availability: votes,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving response:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
