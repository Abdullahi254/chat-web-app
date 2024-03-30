"use client"
import { BioData } from '@/app/group/[id]/page';
import { handleRemoveMember } from '@/lib/actions';
import React, { useState } from 'react'
import { MdDelete } from "react-icons/md";
type Props = {
    groupBio?: BioData
}

const MembersList = ({ groupBio }: Props) => {
    const [more, setMore] = useState<number | undefined>(5)
    const handleMore = () => {
        if (more && more > 5) {
            setMore(5)
        }
        else setMore(groupBio?.users.length)
    }
    return (
        <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center flex-wrap overflow-auto scrollbar-thumb-gray-400 scrollbar-track-white scrollbar-thin'>
            <h1 className='font-bold ml-2'>Members:</h1>
            <div className='flex items-center space-x-4'>
                {

                    groupBio?.users.slice(0, more).map(user => (
                        <ul className='flex items-center flex-auto min-w-0 max-w-full ' key={user.id}>
                            <li className='text-sm text-gray-900 none'>{user.username} </li>
                            <span className='cursor-pointer hover:text-red-500' onClick={async () => handleRemoveMember(groupBio, user.id)}><MdDelete /></span>
                        </ul>
                    ))
                }
                {
                    groupBio?.users && groupBio?.users.length > 5 &&
                    <span className='text-blue-500 underline text-xs cursor-pointer' onClick={handleMore}>{
                        more && more > 5 ? "Less" : "More"
                    }</span>
                }

            </div>


        </div>
    )
}

export default MembersList
