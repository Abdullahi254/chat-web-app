import React from 'react'
import Image from 'next/image'
import dp from "../../public/dp.jpg"
import { CiCamera } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import AddChat from './AddChat';
import { IoReturnDownBack } from "react-icons/io5";
import Link from 'next/link';
import AddFriend from './AddFriend';

import { getUserId } from '@/app/page';
import { redirect } from 'next/navigation';
import Name from './Name';
import { deleteGroup } from '@/lib/actions';
import DeleteIcon from './DeleteIcon';

type Props = {
    profileId: string,
}

export type BioData = {
    username: string;
    email: string;
    groups: any[];
    isFriend: boolean;
}


async function getUserBio(userId: string, friendId: string): Promise<BioData> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_user_bio/${userId}/${friendId}`, { next: { tags: ['bio'] } });
        if (!response.ok) {
            // redirect(`/group/${friendId}`)
        }
        const data: BioData = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        throw error;
    }
}


const ProfileCard = async ({ profileId }: Props) => {
    const userId = await getUserId();
    const bioData = await getUserBio(userId, profileId)
    return (
        <div className='bg-gray-200 max-w-screen-md mx-auto p-6 flex flex-col space-y-6 items-center rounded-lg shadow-xl shadow-gray-800'>
            <div className='flex items-center w-full px-2 justify-end'>
                <Link href="/">
                    <div className='text-lg p-2 hover:rounded-full hover:bg-gray-50'>
                        <IoReturnDownBack />
                    </div>
                </Link>

            </div>
            <div className='relative'>
                <Image width={100} height={100} className="h-[100px] w-[100px] rounded-full" src={dp} alt="Dp" priority />
                <CiCamera className='absolute bottom-0 right-0 cursor-pointer hover:font-bold' />
            </div>

            <Name userId={userId} bioData={bioData} />
            <div className='space-x-2 flex items-center w-full px-2'>
                <h1 className='font-bold'>Bio:</h1>
                <p className='text-sm text-gray-900'>Can&apos;t Talk What&apos;s up?</p>
                {/* <span className='cursor-pointer'><CiEdit /></span> */}
            </div>

            <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                <h1 className='font-bold ml-2'>Groups:</h1>
                {
                    bioData?.groups?.map(group => (
                        <div className='space-x-2 flex' key={group._id}>
                            <li className='text-sm text-gray-900'>{group.name}</li>
                            {
                                group?.createdBy === userId &&
                                <DeleteIcon groupId={group._id as string} userId={userId} />

                            }

                        </div>
                    ))
                }
            </div>

            {/* if the profile is not equal to user id, can't add friend
            if user is already your friend, don't display ui
            chatId is for a group chat, user gets redirected*/}
            {
                profileId !== userId && !bioData.isFriend &&
                <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                    <h1 className='font-bold ml-2'>Add Friend:</h1>
                    <AddFriend userId={userId} profileId={profileId} />
                </div>

            }
            {/* You can only create a group if you are accessing your own bio */}
            {
                profileId === userId &&
                <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                    <h1 className='font-bold ml-2'>Create Group:</h1>
                    <AddChat userId={userId} />
                </div>
            }

        </div>
    )
}

export default ProfileCard