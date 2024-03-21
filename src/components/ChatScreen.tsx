"use client"

import React, { useEffect, useState } from 'react'
import { IoMdSend } from "react-icons/io";
import MessageBubble from './MessageBubble';
import { io } from 'socket.io-client';

import { Props as MessageInfo } from "./MessageBubble"

type Props = {
    userId: string
}


const ChatScreen = ({userId}: Props) => {
    const chat_socket = io('http://localhost:4000')
    //NOTE: Might change this to target the other user instead
    //const [onlineStatus, setOnlineStatus] = useState(chat_socket.connected)
    const [messageList, setMessageList] = useState<MessageInfo[]>([])
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
        chat_socket.on('message:sent', (msg) => {
            setMessageList((prevMsg) => [...prevMsg as MessageInfo[], msg])
        })
        return () => {
            //NOTE: Necessary to avoid double messages.
            chat_socket.off('connect')
            chat_socket.off('message:sent')
        }
    }, [messageList])


    const handleMessageSent = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get("chat")
        if (typeof (message) === 'string') {
            const sentMessage: MessageInfo = {
                message,
                status: true,
                timeStamp: "19/03/2024 15:05",
                userName: "Sender One"
            }
            chat_socket.timeout(3000).emit('message:send', { msg: sentMessage })
        }
    }

    return (
        <div className='col-span-2 border-l-gray-950 border-l-2 px-6 relative flex flex-col h-full'>
            {/* list of messages being received */}
            <div className=' overflow-y-scroll sm:max-h-[700px] md:max-h-[900px] lg:max-h-[1100px] space-y-3'>
                {messageList?.map((data, index) => <MessageBubble
                    message={data.message}
                    status={data.status}
                    timeStamp={data.timeStamp}
                    key={index}
                    userName={data.userName}
                />)}
            </div>

            <form className='absolute bottom-1 w-full lg:px-2' onSubmit={handleMessageSent} >
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                    <textarea id="chat" name='chat' rows={2} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500" placeholder="Your message..."></textarea>
                    <button type="submit" className="inline-flex justify-center p-2 text-gray-900 rounded-full cursor-pointer hover:bg-gray-100">
                        <IoMdSend className='text-xl' />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatScreen
