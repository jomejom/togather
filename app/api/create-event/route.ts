import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { title, organizerName, timeSlots } = data;

    const event = await prisma.event.create({
      data: {
        title,
        organizerName,
        timeSlots: {
          create: timeSlots.map((slot: { start: string; end: string }) => ({
            start: new Date(slot.start),
            end: new Date(slot.end),
          })),
        },
      },
    });

    // Return the new event's ID
    return NextResponse.json({ id: event.id });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
