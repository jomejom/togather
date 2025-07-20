"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS, 
  },
});


export default function CreateEventPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // creating states for the time slot builder
  // proposedTimeSlots will be an array of objects that contain the Dates start and end
  const [proposedTimeSlots, setProposedTimeSlots] = useState<
    { start: Date; end: Date }[]
  >([]);

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
        title,
        organizerName: name,
        timeSlots: proposedTimeSlots.map(slot => ({
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
        })),
      }),
    });
  
    const data = await res.json();
    setLoading(false);
  
    // after submitting, send users to their invite page
    router.push(`/invite/${data.id}`);
  }
  
  // Allow user to input their name, description, and select time on a calendar
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

        <Calendar
          localizer={localizer}
          defaultView="week"
          views={["week", "day"]}
          selectable
          style={{ height: 500, width: "100%" }}
          onSelectSlot={(slotInfo) => {
            setProposedTimeSlots([
              ...proposedTimeSlots,
              {
                start: slotInfo.start,
                end: slotInfo.end,
              },
            ]);
          }}
          events={proposedTimeSlots.map((slot, i) => ({
            id: i,
            title: "Selected",
            start: slot.start,
            end: slot.end,
          }))}
          step={30}
          timeslots={2}
        />

        <button type="submit" className="p-2 bg-green-400 rounded text-white">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
