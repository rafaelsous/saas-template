import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Landing Page</h1>

      <Link className="hover:text-gray-700" href="/login">Login</Link>
    </div>
  );
}