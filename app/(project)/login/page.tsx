import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-10 text-4xl font-bold">Login Page</h1>

      <form action={handleAuth}>
        <button
          className="px-4 py-2 border rounded-md cursor-pointer"
          type="submit"
        >
          Signin with Google
        </button>
      </form>
    </div>
  );
}
