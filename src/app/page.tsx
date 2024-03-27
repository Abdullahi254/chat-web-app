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

export const getUserId = async ():Promise<string> => {
  const cookieStore = cookies()
  const token = cookieStore.get('x-token')?.value
  const results = await getSession(token)
  if (!results) {
    redirect("/login")
  }
  return results.userId["id"]
}

// This function runs on the server and fetches data
export async function getSideChatData(userId:string) {
  const response = await fetch(process.env.REACT_APP_BASE_URL + `/${userId}/chats`);
 
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  // Pass data to the page component as props
  return await response.json();
}

export default async function Home() {
  const userId = await getUserId()
  const rooms: {name: string, _id: string}[] = await getSideChatData(userId)
  return (
    <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <SideChat rooms = {rooms}/>
      <div className=" col-span-2">
        <BlankScreen userId={userId}/>
      </div>

    </main>
  );
}
