import SideChat from '@/components/SideChat'
import ChatScreen from '@/components/ChatScreen'
import React from 'react'
import { getSideChatData, getUserId } from "@/app/page"
import SocketController from '@/server/controllers/socketController'
import { Props as MessageInfo } from "@/components/MessageBubble"

type Props = {
    params: {
        id: string
    }
}

/** Format messages for frontend
 * @param chatId - chat id from url params
 * @returns [array[]] return messages
 */
async function formatMessages(chatId: string, userId: string) {
    let data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_chat_history/${chatId}`, { method: 'GET', next:{ tags: ['collection'] } })
    let results = await data.json()
    console.log(results)
    let formatted_msg = results.map((v: any, k: number) => {
        let tmpMsg = {
            message: v.content,
            timeStamp: v.createdAt,
            userName: userId === v.senderId ? null : v.username,
            msgId: v._id,
            senderId: v.senderId,
            _id: v._id
        };
        return tmpMsg;
    });
    return formatted_msg
}

const page = async ({ params }: Props) => {
    const userId = await getUserId()
    const rooms = await getSideChatData(userId)
    //NOTE: This is easier to get chat history per chat
    let messages: any[] | undefined = await formatMessages(params.id, userId)
    const fileteredRooms = rooms.filter((room: any) => room._id.toString() === params.id)
    const room = fileteredRooms[0]
    return (
        <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
            <SideChat rooms={rooms} userId={userId} />
            <ChatScreen chatId={params.id} userId={userId} msgHistory={messages} room={room} />
        </main>
    )
}

export default page
