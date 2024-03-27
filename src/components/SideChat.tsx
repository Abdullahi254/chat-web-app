import React from 'react'
import { FaSearch } from "react-icons/fa";
import ChatLink from './ChatLink';


type Props = {
  rooms: {
    name: string
    _id: string
  }[]
}

const SideChat = async ({rooms}: Props) => {

  return (
    <div className='border-r-gray-400 border-r-2 col-span-1 flex flex-col space-y-10 items-center max-h-screen overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-white scrollbar-thin'>

      {/* search bar */}
      <form className="flex items-center max-w-sm mx-auto px-2">
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Search Chat..." required />
        </div>
        <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-gray-700 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
          <FaSearch />
        </button>
      </form>

      {/* list of private chats and group chats */}
      <ul className='w-full px-1'>
        {
          rooms.map(room => <ChatLink chatId={room._id} name={room.name} key={room._id} />)
        }
      </ul>

    </div>
  )
}

export default SideChat