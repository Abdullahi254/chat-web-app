import React from 'react'
import ProfileLink from './ProfileLink'
import { IoMdMore } from "react-icons/io";
import Link from 'next/link';

type Props = {
    userId: string
    chatId: string
}

const ChatHeader = ({
    userId,
    chatId
}: Props) => {
    return (
        <div className='w-full space-x-2 p-4 flex justify-between'>
            <nav className='flex-1 flex items-center justify-between px-6 bg-gray-200 rounded-l-lg rounded-r-sm'>
                <h1 className='font-semibold'>Cohort 13</h1>
                {/* we can do a checker here to check If chatId is for group or private chat */}
                <Link href={`/group/${chatId}`}>
                    <div className='text-lg hover:rounded-full hover:bg-white p-2'><IoMdMore /></div>
                </Link>

            </nav>
            <ProfileLink userId={userId} />
        </div>
    )
}

export default ChatHeader