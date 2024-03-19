"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import dp from "../../public/dp.jpg"
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = {
  userName: string
  message: string
  status: boolean
  timeStamp: string
}

const MessageBubble = ({
  userName,
  message,
  status,
  timeStamp
}: Props) => {

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  const triggerMenu = useCallback(() => {
    setShowMenu(!showMenu)
  }, [showMenu])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        triggerMenu()
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, triggerMenu])
  return (
    <div className="flex items-start gap-2.5">
      <Image width={40} className="h-[32px] w-[32px] rounded-full" src={dp} alt="Dp" />
      <div className="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">{userName}</span>
          <span className="text-sm font-normal text-gray-500">{timeStamp}</span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900">{message}</p>
        <span className="text-xs font-normal text-gray-500">{status ? "Delivered" : "Pending"}</span>
      </div>
      <button className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50" type="button" onClick={triggerMenu}>
        <BsThreeDotsVertical />
      </button>
      {
        showMenu ?
          <div className="z-10 absolute right-0 top-[75px] bg-white divide-y divide-gray-100 rounded-lg shadow w-40" ref={ref}>
            <ul className="py-2 text-sm text-gray-700" >
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Reply
              </li>
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Foward
              </li>
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Copy
              </li>
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Delete
              </li>
            </ul>
          </div> : null
      }

    </div>

  )
}

export default MessageBubble