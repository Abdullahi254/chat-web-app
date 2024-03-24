"use client"
import React, { useState } from 'react'
import { IoIosAdd } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
type Props = {}

const AddChat = (props: Props) => {
    const [search, setSearch] = useState<boolean>(true)
    return (
        <>
            {
                search ?
                    <form className="flex items-center max-w-sm mx-auto px-2" onSubmit={(e)=>{
                        e.preventDefault()
                        setSearch(false)
                    }}>
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Search User/Group..." required />
                        </div>
                        <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
                            <FaSearch />
                        </button>
                    </form> :
                    <div className='w-full flex py-4 px-2 justify-center space-x-4 items-center'>
                        <button id='add' className='text-2xl p-4 rounded-full bg-gray-50 cursor-pointer' onClick={()=>setSearch(true)}>
                            <IoIosAdd />
                        </button>
                        <label htmlFor='add' className='text-sm font-semibold'>Add Chat</label>
                    </div>
            }

        </>

    )
}

export default AddChat