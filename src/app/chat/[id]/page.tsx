import SideChat from '@/components/SideChat'
import ChatScreen from '@/components/ChatScreen'
import React from 'react'
import {getSideChatData, getUserId} from "@/app/page"

type Props = {
    params: {
        id: string
    }
}

//fetch text thread from database use chatId to get the data

const page = async ({ params }: Props) => {
    const userId = await getUserId()
    const rooms: {name: string, _id: string}[] = await getSideChatData(userId)
    return (
        <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
            <SideChat rooms={rooms}/>
            <ChatScreen chatId={params.id} userId={userId}/>
        </main>
    )
}

export default page
