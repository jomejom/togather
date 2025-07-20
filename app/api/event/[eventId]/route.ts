import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const eventId = pathSegments[pathSegments.length - 1]; // get eventId from URL

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { timeSlots: true },
  });

  if (!event) {
    return new NextResponse("Event not found", { status: 404 });
  }

  return NextResponse.json(event);
}
