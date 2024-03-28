"use client"
import React, { useEffect, useState, useRef } from 'react'
import { FaBackspace } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import ChatLink from './ChatLink';


type Props = {
  rooms: {
    name: string
    _id: string
  }[]
}

const SideChat = ({ rooms }: Props) => {
  const [chats, setChats] = useState<Props["rooms"]>()
  const [inputValue, setInputValue] = useState<string>('');
  const [show, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log(rooms)
    setChats(rooms)
  }, [rooms])

  useEffect(() => {
    const fetchData = async (inputValue: string) => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search/${inputValue}`);
        const result = await response.json();
        setChats(result);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching data:', error);
      }
    };

    fetchData(inputValue); // Call the async function immediately
  }, [inputValue]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) setShow(true)
    if (e.target.value === '') setShow(false)
    console.log(inputValue)
  };

  const clearInputField = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setChats(rooms)
    setShow(false)
  }
  return (
    <div className='border-r-gray-400 border-r-2 col-span-1 flex flex-col space-y-10 items-center max-h-screen overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-white scrollbar-thin'>

      {/* search bar */}
      <form className="flex items-center max-w-sm mx-auto px-2">
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Search Chat..." required
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
          />
          {show && <span className='absolute z-10 cursor-pointer left-2 top-3.5 text-gray-800' onClick={clearInputField}><FaBackspace /></span>}
        </div>
      </form>

      {/* list of private chats and group chats */}
      {
        loading ? <div className='text-3xl p-2'><AiOutlineLoading className='animate-spin'/></div> :

          <ul className='w-full px-1'>
            {
              chats?.map(room => <ChatLink chatId={room._id} name={room.name} key={room._id} />)
            }
          </ul>
      }

    </div>
  )
}

export default SideChat