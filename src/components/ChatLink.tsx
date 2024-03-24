import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import dp from "../../public/dp.jpg"
// chat link---- when clicked it goes to the text
type Props = {
    chatId:number
    name: string
}

const ChatLink = ({chatId, name}: Props) => {
  return (
    <Link href={`/chat/${chatId}`}>
        <li className='flex border-gray-300 border-b-2 space-x-8 items-center py-4 hover:bg-gray-200 px-2'>
            <Image src={dp} alt='dp' width={60} height={60} className='rounded-full h-[42px] w-[42px]'/>
            <p className='text-sm'>{name}</p>
        </li>
    </Link>
  )
}

export default ChatLink