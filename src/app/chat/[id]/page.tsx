import SideChat from '@/components/SideChat'
import ChatScreen from '@/components/ChatScreen'
import SocketController from '@/server/controllers/socketController'
import React from 'react'
import { getSideChatData, getUserId } from "@/app/page"

type Props = {
    params: {
        id: string
    }
}

/** Format messages for frontend
 * @param chatId - chat id from url params
 * @returns [array[]] return messages
 */
async function formatMessages(chatId: string) {
  console.log('', process.env.NEXT_PUBLIC_BASE_URL)
    let data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_chat_history/${chatId}`, { method: 'GET' })
    let results = await data.json()

    let formatted_msg = results.map((v: any, k: number) => {
        let tmpMsg = {
            message: v.content,
            timeStamp: v.createdAt,
            userName: v.sender,
        };
        return tmpMsg;
    });
    return formatted_msg
}

const page = async ({ params }: Props) => {
    const userId = await getUserId()
    const rooms: { name: string, _id: string }[] = await getSideChatData(userId)
    //NOTE: This is easier to get chat history per chat
    let messages = await formatMessages(params.id)
    return (
        <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
            <SideChat rooms={rooms} />
            <ChatScreen chatId={params.id} userId={userId} msgHistory={messages} />
        </main>
    )
}

export default page
