import SideChat from '@/components/SideChat'
import ChatScreen from '@/components/ChatScreen'
import React from 'react'

type Props = {
  params:{
    chatId: string
  }
}

//fetch text thread from database use chatId to get the data

const page = ({params}: Props) => {
  return (
    <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <SideChat/>
      <ChatScreen chatId={params.chatId} />
    </main>
  )
}

export default page