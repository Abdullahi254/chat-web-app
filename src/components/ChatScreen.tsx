"use client"

import React, { useEffect, useState } from 'react'
import { IoMdSend } from "react-icons/io";
import MessageBubble from './MessageBubble';
import { io } from 'socket.io-client';

import { Props as MessageInfo } from "./MessageBubble"

type Props = {
    userId: string
}

//TODO: Come back and reconfigure the sockets according to react hooks
const ChatScreen = ({userId}: Props) => {
    const chat_socket = io('http://localhost:4000')
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState([])
    //NOTE: Might change this to target the other user instead
    const [onlineStatus, setOnlineStatus] = useState(chat_socket.connected)


    const [messageList, setMessageList] = useState<MessageInfo[]>()

    const handleMessageSent = (formData: FormData) => {
        // handle message sent
        const message = formData.get("chat")
        if (typeof (message) === 'string') {
            const sentMessage: MessageInfo = {
                message,
                status: true,
                timeStamp: "19/03/2024 15:05",
                userName: "Sender One"
            }
            setMessageList(prevList => [...prevList as MessageInfo[], sentMessage])
        }
    }

    useEffect(() => {
        // getting a list of messages from the db
        const listOfMessages = [
            {
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis pellentesque id nibh tortor id aliquet lectus",
                status: true,
                timeStamp: '19/03/2024 15:05',
                userName: 'John Doe'
            },
            {
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis pellentesque id nibh tortor id aliquet lectus",
                status: true,
                timeStamp: '19/03/2024 15:05',
                userName: 'John Doe'
            },
            {
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis pellentesque id nibh tortor id aliquet lectus",
                status: true,
                timeStamp: '19/03/2024 15:05',
                userName: 'John Doe'
            },
            {
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis pellentesque id nibh tortor id aliquet lectus",
                status: true,
                timeStamp: '19/03/2024 15:05',
                userName: 'John Doe'
            },
        ]
        setMessageList(prevList => [...listOfMessages])
    }, [])

    useEffect(() => {
        chat_socket.on('connect', () => {
            setOnlineStatus(true)
        })

        chat_socket.on('disconnect', () => {
            setOnlineStatus(false)
        })

        if (message !== null) {
            //NOTE: Possibly attach the user id from database
            chat_socket.emit('message:send', { msg: message })
        }
        //NOTE: UI is not updating as message come in.
        // chat_socket.on('message:sent', (msg) => {
        //     let msgArray = []
        //     console.log(msg.msg)
        //     msgArray.push(msg.msg)
        //     setMessages(msgArray);
        // })
    }, [])
        // if (message && message.length !== 0) {

        //     //NOTE: Possibly attach the user id from database
        //     chat_socket.emit('message:send', { msg: message })
        // }
        //NOTE: UI is not updating as message come in.
        // chat_socket.on('message:sent', (msg) => {
        //     let msgArray = []
        //     console.log(msg.msg)
        //     msgArray.push(msg.msg)
        //     setMessages(msgArray);
        // })
    // }, [])
    
    return (
        <div className='col-span-2 border-l-gray-950 border-l-2 px-6 relative flex flex-col h-full'>
            {/* list of messages being received */}
            <div className=' overflow-y-scroll sm:max-h-[700px] md:max-h-[900px] lg:max-h-[1100px] space-y-3'>
                {messageList?.map((message, index) => <MessageBubble
                    message={message.message}
                    status={message.status}
                    timeStamp={message.timeStamp}
                    key={index}
                    userName={message.userName}
                />)}
            </div>

            <form className='absolute bottom-1 w-full lg:px-2' onSubmit={()=>console.log("ppapap")} action={handleMessageSent}>
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