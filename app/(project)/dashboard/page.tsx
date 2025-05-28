import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { handleAuth } from "@/app/actions/handle-auth";
import Link from "next/link";

export default async function Dasboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Protected Dasboard Page</h1>
      <p>{session?.user?.email ? session.user.email : "Usuário não logado"}</p>

      {session?.user?.email && (
        <form action={handleAuth} className="mt-10 mb-4">
          <button
            className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-200"
            type="submit"
          >
            Logout
          </button>
        </form>
      )}

      <Link className="hover:text-gray-700" href="/payments">Payments</Link>
    </div>
  );
}
