"use client"
import { BioData } from '@/app/group/[id]/page';
import React, { useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { TiTick } from "react-icons/ti";
import { updateAbout } from "@/lib/actions"
import { MdCancel } from "react-icons/md";
import { useFormStatus } from 'react-dom'
type Props = {
    groupBio?: BioData
    chatId: string
}

const Status = ({ groupBio, chatId }: Props) => {
    const [showInput, setShowInput] = useState<boolean>(true)
    const updateAboutWithId = updateAbout.bind(null, chatId)

    const { pending } = useFormStatus()
    return (
        <div className='space-x-2 flex items-center w-full px-2'>
            <h1 className='font-semibold text-xs'>About:</h1>
            {
                showInput ?
                    <div className='flex items-center space-x-2'>
                        <p className='text-sm text-gray-900'>Group chat for a group project.</p>
                        <span className='cursor-pointer' onClick={() => setShowInput(false)}><CiEdit /></span>
                    </div> :
                    <div className='flex items-center space-x-2'>
                        <form className='flex items-center space-x-2' action={updateAboutWithId}>
                            <input type="text" id="about" name="about" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block ps-10 p-2.5 flex-1" placeholder="Enter Text" />
                            <button type='submit' onClick={() => {
                                if (!pending) {
                                    setShowInput(true)
                                }
                            }} aria-disabled={pending}>
                                <TiTick className='hover:text-green-500 text-lg text-gray-700 disabled:text-gray-50' />
                            </button>
                        </form>
                        <button onClick={() => {
                            if (!pending) {
                                setShowInput(true)
                            }
                        }} aria-disabled={pending}>
                            <MdCancel className='text-red-500 text-lg disabled:text-gray-50' />
                        </button>
                    </div>
            }


        </div>

    )
}

export default Status