"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import dp from "../../public/dp.jpg"
import { usePathname, useRouter } from 'next/navigation'
// chat link---- when clicked it goes to the text
type Props = {
  chatId: string
  name: string
}

const ChatLink = ({ chatId, name }: Props) => {
  const pathName = usePathname()
  const router = useRouter()
  const handleProfileView = () => {
    router.push(`/profile/${chatId}`)
  }
  return (
    <>

      <li className={
        pathName === `/chat/${chatId}` ?
          'flex border-gray-300 border-b-2 space-x-8 items-center py-4 hover:bg-gray-200 px-2 bg-gray-300 rounded-lg' :
          'flex border-gray-300 border-b-2 space-x-8 items-center py-4 hover:bg-gray-200 px-2'
      }
      >
        <Image src={dp} alt='dp' width={60} height={60} className='rounded-full h-[42px] w-[42px] cursor-pointer' onClick={handleProfileView} />
        <Link href={`/chat/${chatId}`} className='cursor-pointer'>
          <p className='text-sm'>{name}</p>
        </Link>
      </li>
    </>

  )
}

export default ChatLink