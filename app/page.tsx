import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#E2F5D7]">
      <Link href="/create-event" className="p-4 bg-green-400 text-white rounded">
        schedule time toGather
      </Link>
    </div>
  );
}
