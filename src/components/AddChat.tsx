"use client"
import React, {useState } from 'react'
import { IoIosAdd } from "react-icons/io";
import { createGroup } from '@/lib/actions';
type Props = {
    userId: string
}

const AddChat = ({userId}: Props) => {
    const [search, setSearch] = useState<boolean>(false)
    const createGroupWithId = createGroup.bind(null,userId)
    
    // const handleCreateGroup = async (e:  React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     setSearch(false)
    //     const formData =  new FormData(e.currentTarget);
    //     const groupName = formData.get('create');

    //     if (groupName) {
    //        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create_chat`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 isRoomChat: true,
    //                 name: groupName,
    //                 userId
    //             })
    //         })
    //         revalidateTag("bio")
    //     }
    // }
    return (
        <>
            {
                search ?
                    <form className="flex items-center max-w-sm mx-auto px-2" action={createGroupWithId}>
                        <label htmlFor="Create" className="sr-only">Create</label>
                        <div className="relative w-full">
                            <input type="text" id="create" name="create" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Enter name..."/>
                        </div>
                        <button type="submit" className="p-2.5 ms-2 text-xs font-medium text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300" >
                            submit
                        </button>
                    </form> :
                    <div className='w-full flex py-4 px-2 space-x-4 items-center'>
                        <button id='add' className='text-lg p-2 rounded-full bg-gray-50 cursor-pointer' onClick={()=>setSearch(true)}>
                            <IoIosAdd />
                        </button>
                    </div>
            }

        </>

    )
}

export default AddChat