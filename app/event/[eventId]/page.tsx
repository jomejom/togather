"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

// This function takes a single argument. 
// That argument is an object with a key params, and params must contain an eventId string. 
// Pull out the params object directly so we can use it inside the function
export default function EventPage({ params }: {params: { eventId: string}}) {
    const { eventId } = useParams();

    const [eventData, setEventData] = useState<null | {
        title: string;
        organizerName: string;
        timeSlots: { id: string; start: string; end: string }[];
    }>(null);

    const [votes, setVotes] = useState<Record<string, boolean | null>>({});
    const [currentSlotIndex, setCurrentSlotIndex] = useState(0);

    useEffect(() => {
        async function fetchEvent() {
          const res = await fetch(`/api/event/${eventId}`);
          const data = await res.json();
          setEventData(data);
        }

        if (eventId) fetchEvent();
    }, [eventId]);
        
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E2F5D7] px-6 py-6 text-black">
          {eventData ? (
            <main className="flex flex-col items-center justify-center bg-white rounded-xl max-w-xl p-6 space-y-4">
              <p>{eventData.organizerName} wants to see you!</p>
              <h2 className="font-bold">{eventData.title}</h2>
              <p>Are you free?</p>
      
              {eventData.timeSlots.length > 0 && currentSlotIndex < eventData.timeSlots.length && (
                <div className="bg-white p-4 rounded shadow w-full max-w-xl text-black space-y-4">
                  <h3 className="text-md font-bold">
                    {eventData.organizerName} wants to meet at:
                  </h3>

                  <p className="text-lg">
                    {new Date(eventData.timeSlots[currentSlotIndex].start).toLocaleString()} →{" "}
                    {new Date(eventData.timeSlots[currentSlotIndex].end).toLocaleString()}
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded"
                      onClick={() => {
                        setVotes({ ...votes, [eventData.timeSlots[currentSlotIndex].id]: true });
                        setCurrentSlotIndex(currentSlotIndex + 1);
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => {
                        setVotes({ ...votes, [eventData.timeSlots[currentSlotIndex].id]: false });
                        setCurrentSlotIndex(currentSlotIndex + 1);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {currentSlotIndex >= eventData.timeSlots.length && (
                <div className="mt-6 p-4 rounded shadow w-full max-w-xl text-center">
                  <h2 className="text-xl font-bold mb-4">Thanks for your responses!</h2>
                  <p>Here's what you voted:</p>
                  <ul className="mt-2 space-y-1">
                    {eventData.timeSlots.map((slot) => (
                      <li key={slot.id}>
                        {new Date(slot.start).toLocaleString()} →{" "}
                        {new Date(slot.end).toLocaleString()} —{" "}
                        {votes[slot.id] === true ? "✅ Yes" : "❌ No"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
            </main>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
}