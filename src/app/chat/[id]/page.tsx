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
async function formatMessages(chatId: string) {
    let data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_chat_history/${chatId}`, { method: 'GET' })
    let results = await data.json()

    let formatted_msg = results.map((v: any, k: number) => {
        let tmpMsg = {
            message: v.content,
            timeStamp: v.createdAt,
            //TODO: Display the username on the actual message
            userName: v.senderId,
        };
        return tmpMsg;
    });
    return formatted_msg
}

const page = async ({ params }: Props) => {
    const userId = await getUserId()
    const rooms: { name: string, _id: string, users: string[], isRoomChat: boolean }[] = await getSideChatData(userId)
    //NOTE: Temp fix for private chat
    //NOTE: This will make sure the chat name will show up on SideChat
    rooms.map(async (v, k) => {
        if (v.users[0] === userId && !v.isRoomChat) {
            let name = await SocketController.fetchUserName(v.users[1])
            console.log(name)
            v.name = name
        } else if (v.users[1] === userId && !v.isRoomChat) {
            let name = await SocketController.fetchUserName(v.users[0])
            console.log(name)
            v.name = name
        } else {
            console.log('Group Chat')
        }
    })
    //NOTE: This is easier to get chat history per chat
    let messages: MessageInfo[] | undefined = await formatMessages(params.id)
    return (
        <main className="grid grid-cols-3 min-h-screen py-10 px-6 max-w-7xl mx-auto">
            <SideChat rooms={rooms} />
            <ChatScreen chatId={params.id} userId={userId} msgHistory={messages} />
        </main>
    )
}

export default page
