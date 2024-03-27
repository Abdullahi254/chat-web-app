import React from 'react'
import Image from 'next/image'
import dp from "../../public/dp.jpg"
import { CiCamera } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import AddChat from './AddChat';
import { getUserId } from '@/app/page';
import { IoReturnDownBack } from "react-icons/io5";
import Link from 'next/link';
import AddFriend from './AddFriend';
import { group } from 'console';
type Props = {
    profileId: string
}

type BioData = {
    username: string
    groups: {id: string, name: string}[],
    email: string
    isFriend: boolean
}

// You can fetch the user data using profileId

const fetchBio = async (userId: string, profileId: string) => {
    const response = await fetch(process.env.REACT_APP_BASE_URL + `/get_user_bio/${userId}/${profileId}`);
    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return await response.json()
}

const ProfileCard = async ({ profileId }: Props) => {
    const userId = await getUserId();
    const bioData: BioData = await fetchBio(userId, profileId);
    console.log(bioData)


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

            <div className='space-x-2 flex items-center w-full px-2 justify-center'>
                <h1 className='tracking-widest text-sm font-semibold'>{bioData.username}</h1>
                <span className='cursor-pointer'><CiEdit /></span>
            </div>

            <div className='space-x-2 flex items-center w-full px-2'>
                <h1 className='font-bold'>Bio:</h1>
                <p className='text-sm text-gray-900'>Can&apos;t Talk What&apos;s up?</p>
                <span className='cursor-pointer'><CiEdit /></span>
            </div>

            <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                <h1 className='font-bold ml-2'>Groups:</h1>
                {
                    bioData.groups.map(group => (
                        <div className='space-x-2 flex' key={group.id}>
                        <li className='text-sm text-gray-900'>{group.name}</li>
                        <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                        </div>  
                    ))
                }
            </div>

            {/* if the profile is not equal to user id, can't add friend
            We can also check here if user is already your friend, if so don't display ui
            als check if chatId is for a group chat, If it is don't display ui */}
            {
                profileId !== userId && 
                // !isFriend
                // !isGroup
                <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                    <h1 className='font-bold ml-2'>Add Friend:</h1>
                    <AddFriend userId={userId}/>
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