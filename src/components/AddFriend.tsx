"use client"
import React, { useState } from 'react'
import { IoIosAdd } from "react-icons/io";
type Props = {
    userId: string
    profileId: string
}


function AddFriend({ userId, profileId }: Props) {
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const addFriend = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/add_friend/${userId}/${profileId}`);
    const results = await response.json()
    if (!response.ok) {
      setError(results.Error)
      return
    }
    setSuccess(results.message)
  }
  return (
    <div className='w-full flex py-4 px-2 space-x-4 items-center'>
      <button id='add' className='text-lg p-2 rounded-full bg-gray-100 hover:bg-gray-50 cursor-pointer' onClick={addFriend}>
        <IoIosAdd />
      </button>
      {
        success && <p className='text-xs tracking-wide text-green-500'>{success}</p>
      }
      {
        error && <p className='text-xs tracking-wide text-red-500'>{error}</p>
      }
    </div>
  )
}

export default AddFriend
