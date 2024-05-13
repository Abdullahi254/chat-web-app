"use client"
import Image from 'next/image'
import React from 'react'
import dp from "../../public/dp.jpg"
import { usePathname, useRouter } from 'next/navigation'
// chat link---- when clicked it goes to the text
export type Props = {
  _id: string
  name: string
  isFriend: boolean
  isRoomChat: boolean
}

const SearchLink = ({ _id, name, isFriend, isRoomChat }: Props) => {
  const router = useRouter()
  const handleProfileView = () => {
    console.log("isFriend", isFriend)
    if(!isRoomChat){
        router.push(`/profile/${_id}`)
    }    
  }
  return (
    <>
      <li className='flex border-gray-300 border-b-2 space-x-8 items-center py-4 hover:bg-gray-200 px-2'
      >
        <Image src={dp} alt='dp' width={60} height={60} className='rounded-full h-[22px] w-[22px] cursor-pointer' onClick={handleProfileView} />
        <p className='text-xs'>{name}</p>
      </li>
    </>

  )
}

export default SearchLink