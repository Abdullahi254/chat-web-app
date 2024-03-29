import React from "react";
import dp from "../../../../public/dp.jpg";
import { CiCamera } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { IoReturnDownBack } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { getUserId } from "@/app/page";
import AddMember from "@/components/AddMember";
import { MdDelete } from "react-icons/md";

type Props = {
  params: {
    id: string;
  };
};

type BioData = {
  name: string;
  users: { id: string; username: string }[];
};

// You can fetch the user data using profileId

const fetchGroupBio = async (chatId: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + `/chats/${chatId}`
  );
  // console.log(response)
  console.log(chatId);
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return await response.json();
};

const page = async ({ params }: Props) => {
  const userId = await getUserId();
  const groubBio: BioData = await fetchGroupBio(params.id);

  return (
    <main className="h-screen py-10 px-6 pattern w-full">
      <div className="bg-gray-200 max-w-screen-md mx-auto p-6 flex flex-col space-y-6 items-center rounded-lg shadow-xl shadow-gray-800">
        <div className="flex items-center w-full px-2 justify-end">
          <Link href="/">
            <div className="text-lg p-2 hover:rounded-full hover:bg-gray-50">
              <IoReturnDownBack />
            </div>
          </Link>
        </div>
        <div className="relative">
          <Image
            width={100}
            height={100}
            className="h-[100px] w-[100px] rounded-full"
            src={dp}
            alt="Dp"
            priority
          />
          <CiCamera className="absolute bottom-0 right-0 cursor-pointer hover:font-bold" />
        </div>

        <div className="space-x-2 flex items-center w-full px-2 justify-center">
          <h1 className="tracking-widest text-sm font-semibold">
            {groubBio.name}
          </h1>
          <span className="cursor-pointer">
            <CiEdit />
          </span>
        </div>

        <div className="space-x-2 flex items-center w-full px-2">
          <h1 className="font-bold">About:</h1>
          <p className="text-sm text-gray-900">
            Group chat for a group project.
          </p>
          <span className="cursor-pointer">
            <CiEdit />
          </span>
        </div>

        <div className="space-x-4 flex flex-col py-2 space-y-2 w-full justify-center">
          <h1 className="font-bold ml-2">Members:</h1>
          {groubBio.users.map((user) => (
            <div className="space-x-2 flex" key={user.id}>
              <li className="text-sm text-gray-900">{user.username} </li>
              <span className="cursor-pointer hover:text-red-500">
                <MdDelete />
              </span>
            </div>
          ))}
        </div>

        <div className="space-x-4 flex flex-col py-2 space-y-2 w-full justify-center">
          <h1 className="font-bold ml-2">Add Member:</h1>
          <AddMember userId={userId} chatId={params.id as string} />
        </div>
      </div>
    </main>
  );
};

export default page;
