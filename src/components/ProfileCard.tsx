import React from 'react'
import Image from 'next/image'
import dp from "../../public/dp.jpg"
import { CiCamera } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import AddChat from './AddChat';
type Props = {}

const ProfileCard = (props: Props) => {
    return (
        <div className='bg-gray-200 max-w-screen-md mx-auto p-6 flex flex-col space-y-6 items-center rounded-lg shadow-xl shadow-gray-800'>
            <div className='relative'>
                <Image width={100} height={100} className="h-[100px] w-[100px] rounded-full" src={dp} alt="Dp" priority />
                <CiCamera className='absolute bottom-0 right-0 cursor-pointer hover:font-bold' />
            </div>

            <div className='space-x-2 flex items-center w-full px-2 justify-center'>
                <h1 className='tracking-widest text-sm font-semibold'>Jane Doe</h1>
                <span className='cursor-pointer'><CiEdit /></span>
            </div>

            <div className='space-x-2 flex items-center w-full px-2'>
                <h1 className='font-bold'>Bio:</h1>
                <p className='text-sm text-gray-900'>Can&apos;t Talk What&apos;s up?</p>
                <span className='cursor-pointer'><CiEdit /></span>
            </div>

            <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                <h1 className='font-bold ml-2'>Groups:</h1>

                <div className='space-x-2 flex '>
                    <li className='text-sm text-gray-900'>ALX GROUP </li>
                    <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                </div>
                <div className='space-x-2 flex '>
                    <li className='text-sm text-gray-900'>ALX GROUP </li>
                    <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                </div>
                <div className='space-x-2 flex '>
                    <li className='text-sm text-gray-900'>ALX GROUP </li>
                    <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                </div>
            </div>

            <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                <h1 className='font-bold ml-2'>Add Friend:</h1>
                <AddChat />
            </div>
            <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                <h1 className='font-bold ml-2'>Create Group:</h1>
                <AddChat />
            </div>
        </div>
    )
}

export default ProfileCard