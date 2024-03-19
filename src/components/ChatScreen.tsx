"use client"

import React from 'react'
import { IoMdSend } from "react-icons/io";
import MessageBubble from './MessageBubble';
type Props = {}

const ChatScreen = (props: Props) => {

    const handleMessageSent = (formData: FormData)=>{
        // handle message sent 
        const message = formData.get("chat")
        console.log(message)
    }

    return (
        <div className='col-span-2 border-l-gray-950 border-l-2 px-6 relative flex flex-col space-y-3'>
            {/* list of messages being received */}
            {[1, 2, 3].map(val => <MessageBubble
                message='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis pellentesque id nibh tortor id aliquet lectus. Elementum nibh tellus molestie nunc non blandit massa enim.'
                status = {true}
                timeStamp='19/03/2024 15:05'
                key={val}
                userName='John Doe'
            />)}

            <form className='absolute bottom-1 w-full lg:px-2' action={handleMessageSent}>
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