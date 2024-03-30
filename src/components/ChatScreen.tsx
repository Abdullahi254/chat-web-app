"use client"

import React, { useEffect, useState } from 'react'
import { IoMdSend } from "react-icons/io";
import MessageBubble from './MessageBubble';
import { io } from 'socket.io-client';

import { Props as MessageInfo } from "./MessageBubble"
import ProfileLink from './ProfileLink';
import ChatHeader from './ChatHeader';

type Props = {
    chatId: string,
    userId: string,
    msgHistory?: MessageInfo[],
    room: any
}
type SentMessage = {
    chatId: string
    userId: string
} & MessageInfo

const ChatScreen = ({ userId, chatId, msgHistory, room }: Props) => {
    //TODO: Make base url consistent
    const chat_socket = io(process.env.NEXT_PUBLIC_BASE_URL + '')
    const [messageList, setMessageList] = useState<MessageInfo[]>()
    console.log('-------->', messageList)
    useEffect(() => {
        setMessageList(msgHistory)
    }, [msgHistory])

    //NOTE: Might change this to target the other user instead
    //const [onlineStatus, setOnlineStatus] = useState(chat_socket.connected)
    useEffect(() => {
        /*
         * NOTE: Probably put this back when logic is ready
                chat_socket.on('connect', () => {
                    setOnlineStatus(true)
                })
        
                chat_socket.on('disconnect', () => {
                    setOnlineStatus(false)
                })
                */
        chat_socket.on(`${chatId}:message:sent`, (msg) => {
            console.log(msg)
            setMessageList((prevMsg) => [...prevMsg as MessageInfo[], msg])
        })
        return () => {
            //NOTE: Necessary to avoid double messages.
            chat_socket.off('connect')
            chat_socket.off(`${chatId}:message:sent`)
        }
    }, [chatId, chat_socket])


    const handleMessageSent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get("chat")
        if (typeof (message) === 'string') {
            const sentMessage: SentMessage = {
                userName: "",
                userId,
                chatId,
                message,
                timeStamp: Date.now()
            }
            console.log(sentMessage)
            chat_socket.timeout(3000).emit('message:send', sentMessage)
        }
    }

    return (
        <div className='col-span-2 px-6 relative max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-400 scrollbar-track-white scrollbar-thin flex flex-col'>
            <ChatHeader userId={userId} chatId={chatId} room={room} />
            {/* list of messages being received */}
            <div className='space-y-3 mb-4 flex-grow'>
                {messageList?.map((data, index) => <MessageBubble
                    message={data.message}
                    timeStamp={data.timeStamp}
                    key={index}
                    userName={data.userName}
                    msgId={data.msgId}
                    userId={userId}
                />)}
            </div>

            {/* chat text area */}
            <form className='w-full' onSubmit={handleMessageSent} >
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                    <textarea id="chat" name='chat' rows={2} className="block mx-4 p-2.5 w-[80%] text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500" placeholder="Your message..."></textarea>
                    <button type="submit" className="inline-flex justify-center p-2 text-gray-900 rounded-full cursor-pointer hover:bg-gray-100">
                        <IoMdSend className='text-xl' />
                    </button>
                </div>
            </form>
        </div>

    )
}

export default ChatScreen
