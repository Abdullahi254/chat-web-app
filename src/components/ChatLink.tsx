"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import dp from "../../public/dp.jpg"
import { usePathname, useRouter } from 'next/navigation'
// chat link---- when clicked it goes to the text
type Props = {
  room: any
  userId: string
}

const ChatLink = ({ room, userId }: Props) => {
  const pathName = usePathname()
  return (
    <>

      <li className={
        pathName === `/chat/${room._id}` ?
          'flex border-gray-300 border-b-2 space-x-8 items-center py-4 hover:bg-gray-200 px-2 bg-gray-300 rounded-lg' :
          'flex border-gray-300 border-b-2 space-x-8 items-center py-4 hover:bg-gray-200 px-2'
      }
      >
        {
          room.isRoomChat ?
            <Link href={`/group/${room._id}`}>
              <Image src={dp} alt='dp' width={60} height={60} className='rounded-full h-[22px] w-[22px]' />
            </Link> :
            <Link href={room.users[0] === userId ? `/profile/${room.users[1]}` : `/profile/${room.users[0]}`}>
              <Image src={dp} alt='dp' width={60} height={60} className='rounded-full h-[22px] w-[22px]' />
            </Link>
        }


        <Link href={`/chat/${room._id}`} className='cursor-pointer'>
          <p className='text-xs'>{
            room.isRoomChat ? room.name :
              room.info[0].id === userId ? room.info[1].name : room.info[0].name
          }</p>
        </Link>
      </li>
    </>

  )
}

export default ChatLink