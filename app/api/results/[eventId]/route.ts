import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const eventId = pathSegments[pathSegments.length - 1]; // extracts the ID from the URL

  try {
    const responses = await prisma.response.findMany({
      where: { eventId },
    });

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
