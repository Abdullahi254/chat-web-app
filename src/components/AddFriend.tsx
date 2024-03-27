import React from 'react'
import { IoIosAdd } from "react-icons/io";
type Props = {
    userId:string
}

function AddFriend({userId}: Props) {
  return (
    <div className='w-full flex py-4 px-2 space-x-4 items-center'>
    <button id='add' className='text-lg p-2 rounded-full bg-gray-100 hover:bg-gray-50 cursor-pointer'>
        <IoIosAdd />
    </button>
</div>
  )
}

export default AddFriend