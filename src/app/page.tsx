import BlankScreen from "@/components/BlankScreen";
import SideChat from "@/components/SideChat";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async (token?: string) => {
  if (!token) {
    console.log("Token is invalid");
    return false;
  }
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/verify_token?token=${token}`
    );
    if (res.status === 200) {
      console.log("Token is valid");
      return res.json();
    } else {
      console.log("Token is invalid");
      return false;
    }
  } catch (er) {
    if (er instanceof Error) {
      console.log(er.message)
    }
    throw er
  }
}

export default async function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('x-token')?.value
  const results = await getSession(token)
  if (!results) redirect("/login")
  const userId = results.userId["id"]
  //saving userId in the cookie
  return (
    <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <SideChat />
      <div className=" col-span-2">
        <BlankScreen />
      </div>

    </main>
  );
}
