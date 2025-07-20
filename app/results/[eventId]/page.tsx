"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResultsPage() {
  const { eventId } = useParams();
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [timeSlots, setTimeSlots] = useState<{ id: string; start: string; end: string }[]>([]);

  useEffect(() => {
    async function fetchResults() {
      const res = await fetch(`/api/results/${eventId}`);
      const resultData = await res.json();
      setVoteCounts(resultData.voteCounts);

      const eventRes = await fetch(`/api/event/${eventId}`);
      const eventData = await eventRes.json();
      setTimeSlots(eventData.timeSlots);
    }

    if (eventId) fetchResults();
  }, [eventId]);

  return (
    <div className="min-h-screen p-6 bg-[#E2F5D7] text-black">
      <h1 className="text-xl font-bold mb-4">Vote Results</h1>
      <ul className="space-y-4">
        {timeSlots.map((slot) => (
          <li key={slot.id} className="p-4 bg-white rounded shadow">
            <div className="text-md">
              {new Date(slot.start).toLocaleString()} →{" "}
              {new Date(slot.end).toLocaleString()}
            </div>
            <div className="mt-2">
              ✅ Votes: {voteCounts[slot.id] || 0}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
