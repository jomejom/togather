"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // used to get values from a dynamic route
import Link from "next/link";


export default function InvitePage() {
  const { eventId } = useParams();

  const [emails, setEmails] = useState("");

  function handleCopyUrl() {
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  }

  function handleSendInvites() {
    // This is where you'll later send emails to attendees
    alert(`Invites would be sent to: ${emails}`);
  }

  return (
    <div style={{ backgroundColor: "#E2F5D7" }} className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl mb-4">Invite attendees!</h1>

      <input
        className="p-2 border rounded text-black w-80 mb-4"
        type="text"
        placeholder="enter their emails"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
      />

      <button
        onClick={handleSendInvites}
        className="p-2 bg-green-400 rounded text-white mb-4"
      >
        Send Invites
      </button>

      <div className="text-gray-600 mb-2">OR</div>

      <button
        onClick={handleCopyUrl}
        className="p-2 border rounded text-green-600"
      >
        copy url
      </button>

      <Link
        href={`/results/${eventId}`}
        className="mt-6 p-2 bg-blue-500 text-white rounded"
      >
       See my event
      </Link>
    </div>
  );
}
