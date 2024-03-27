import React from 'react'
import dp from "../../../../public/dp.jpg"
import { CiCamera } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { IoReturnDownBack } from "react-icons/io5";
import Link from 'next/link';
import Image from 'next/image';
import {getUserId} from "@/app/page"
import AddMember from '@/components/AddMember';
import { MdDelete } from "react-icons/md";
type Props = {}

const page = async (props: Props) => {
    const userId = await getUserId()
    return (
        <main className="h-screen py-10 px-6 pattern w-full">
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
                <h1 className='tracking-widest text-sm font-semibold'>Cohort 13</h1>
                <span className='cursor-pointer'><CiEdit /></span>
            </div>

            <div className='space-x-2 flex items-center w-full px-2'>
                <h1 className='font-bold'>About:</h1>
                <p className='text-sm text-gray-900'>Group chat for a group project.</p>
                <span className='cursor-pointer'><CiEdit /></span>
            </div>

            <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                <h1 className='font-bold ml-2'>Members:</h1>
                <div className='space-x-2 flex '>
                    <li className='text-sm text-gray-900'>Ahmed </li>
                    <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                </div>
                <div className='space-x-2 flex '>
                    <li className='text-sm text-gray-900'>Oliver</li>
                    <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                </div>
                <div className='space-x-2 flex '>
                    <li className='text-sm text-gray-900'>Sean</li>
                    <span className='cursor-pointer hover:text-red-500'><MdDelete /></span>
                </div>
            </div>

                <div className='space-x-4 flex flex-col py-2 space-y-2 w-full justify-center'>
                    <h1 className='font-bold ml-2'>Add Member:</h1>
                    <AddMember userId={userId}/>
                </div>


        </div>
        </main>
    )
}

export default page