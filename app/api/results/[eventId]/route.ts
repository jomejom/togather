import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// fetches all the responses for an event 
// loop through each attendes availabilities JSON object
// adds up the yes vote for each slot ID
export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const responses = await prisma.response.findMany({
      where: { eventId: params.eventId },
    });

    // Initialize vote counts
    const voteCounts: Record<string, number> = {};

    responses.forEach((response) => {
      const availability = response.availability as Record<string, boolean>;
      Object.entries(availability).forEach(([slotId, isAvailable]) => {
        if (isAvailable) {
          voteCounts[slotId] = (voteCounts[slotId] || 0) + 1;
        }
      });
    });

    return NextResponse.json({ voteCounts });
  } catch (err) {
    console.error("Error loading results:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
