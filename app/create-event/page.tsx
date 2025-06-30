"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // creating states for the time slot builder
  // proposedTimeSlots will be an array of objects that contain the strings start and end
  const [proposedTimeSlots, setProposedTimeSlots] = useState<{ start: string; end: string }[]>([]);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");

  // async function - wait for things to finish before moving on
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); 
    setLoading(true);

    const res = await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        organizerName: name,
        timeSlots: proposedTimeSlots,
      }),
    });

    const data = await res.json();
    setLoading(false);
    router.push(`/invite/${data.id}`);
  }

  return (
    <div style={{ backgroundColor: "#E2F5D7" }} className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-10">

        <input
          className="p-2 border rounded text-black"
          type="text"
          placeholder="Your name"
          value={name}
          // onChange is an event handler that triggers when there is any change in the input field
          onChange={(e) => setName(e.target.value)}
          // HTML attribute that blocks submission if nothing is inputted 
          required
        />

        <input
          className="p-2 border rounded text-black"
          type="text"
          placeholder="What are you doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label>Start Time</label>

          <input className="p-2 border rounded text-green-700"  
          type="datetime-local"
          value={slotStart}
          onChange={(e) => setSlotStart(e.target.value)} // when the user inputs, the value is stored in slotStart and also depicted in the input
          />
          
          <label>End Time</label>
          <input className="p-2 border rounded text-green-700"
          type="datetime-local"
          value={slotEnd}
          onChange={(e) => setSlotEnd(e.target.value)}/>
          <button type="button" 
          onClick={() => {
            if (slotStart && slotEnd) {
              setProposedTimeSlots([...proposedTimeSlots, {start: slotStart, end: slotEnd}]);
              setSlotStart("");
              setSlotEnd("");
            }
          }}
          className="p-2 bg-blue-500 text-white rounded"
          >Add Time Slot</button>
        </div>
      
        {proposedTimeSlots.length > 0 && (
          <ul className="mt-4">
            {proposedTimeSlots.map((slot, i) => (
              <li key={i} className="text-sm text-gray-700">
                {new Date(slot.start).toLocaleString()} → {new Date(slot.end).toLocaleString()}
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="p-2 bg-green-400 rounded text-white">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
