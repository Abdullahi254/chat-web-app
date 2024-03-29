"use client"
import React, {useState} from 'react'
import { CiEdit } from "react-icons/ci";
import { useFormStatus, useFormState  } from 'react-dom'
import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import {updateName} from "@/lib/actions"
import { BioData } from './ProfileCard';
type Props = {
    userId:string
    bioData?: BioData
}


const Name = ({ userId, bioData }: Props) => {
    const [showInput, setShowInput] = useState<boolean>(true)
    const { pending } = useFormStatus()
    const [errorMessage, dispatch] = useFormState(updateName, undefined)
    return (
        <>
            {
                showInput ?
                    <div className='flex items-center space-x-2'>
                        <p className='text-sm text-gray-900'>{bioData?.username}</p>
                        <span className='cursor-pointer' onClick={() => setShowInput(false)}><CiEdit /></span>
                    </div> :
                    <div className='flex items-center space-x-2'>
                        <form className='flex items-center space-x-2' action={dispatch}>
                            <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block ps-10 p-2.5 flex-1" placeholder="New Name" />
                            <input type="text" id="userId" name="userId" defaultValue={userId} hidden />
                            <button type='submit' aria-disabled={pending}>
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
        </>

    )
}

export default Name