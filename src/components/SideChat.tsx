"use client"
import React, { useEffect, useState, useRef } from 'react'
import { FaBackspace } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import ChatLink from './ChatLink';
import SearchLink, { Props as Search } from "./SearchLink"
import { chat_socket } from '@/app/conn'

type Props = {
    rooms: any[],
    userId: string
}

const SideChat = ({ rooms, userId }: Props) => {
    const [chats, setChats] = useState<Props["rooms"]>()
    const [searches, setSearches] = useState<Search[]>()
    const [inputValue, setInputValue] = useState<string>('');
    const [show, setShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [onlineStatus, setOnlineStatus] = useState<boolean>(chat_socket.connected)

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        //console.log(rooms)
        setChats(rooms)
    }, [rooms])

    useEffect(() => {
        chat_socket.auth = { uuid: userId }
        chat_socket.connect()


        console.log(onlineStatus)
        return () => {
            chat_socket.off('connect')
            chat_socket.off('disconnect')
        }
    }, [])

    useEffect(() => {

        console.log(`Socket Connected!: ${chat_socket.connected}`)
        chat_socket.on('connect', () => {
            setOnlineStatus(true)
        })
        //NOTE: Use the database instead to register user being online....
        chat_socket.on('user:connected', (va) => {
            let oldRooms = rooms
            console.log(rooms)
            oldRooms.map((v, k) => {
                //NOTE: This does not work...
                v.info.map((x, y) => {

                    if (x.id === va.uuid) {
                        x.online = true
                    }
                })
            })
            setChats(oldRooms)

            console.log(oldRooms)
        })


        chat_socket.on('disconnect', () => {
            setOnlineStatus(false)
        })

        return () => {
            chat_socket.off('connect')
            chat_socket.off('disconnect')
        }
    }, [])




    useEffect(() => {
        const fetchData = async (inputValue: string) => {
            try {
                setLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search/${inputValue}/${userId}`);
                const result = await response.json();
                console.log(result)
                setSearches(result);
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Error fetching data:', error);
            }
        };

        fetchData(inputValue); // Call the async function immediately
    }, [inputValue, userId]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value) setShow(true)
        if (e.target.value === '') setShow(false)
        console.log(inputValue)
    };

    const clearInputField = () => {
        setInputValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setChats(rooms)
        setShow(false)
    }
    return (
        <div className='border-r-gray-400 border-r-2 col-span-1 flex flex-col space-y-10 items-center max-h-screen overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-white scrollbar-thin'>

            {/* search bar */}
            <form className="flex items-center max-w-sm mx-auto px-2">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5" placeholder="Search Chat..." required
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    {show && <span className='absolute z-10 cursor-pointer left-2 top-3.5 text-gray-800' onClick={clearInputField}><FaBackspace /></span>}
                </div>
            </form>


            {
                inputValue ?
                    loading ? <div className='text-3xl p-2'><AiOutlineLoading className='animate-spin' /></div> :
                        <ul className='w-full px-1'>
                            {
                                searches?.map(search => <SearchLink isFriend={search.isFriend} isRoomChat={search.isRoomChat} name={search.name} _id={search._id} key={search._id} />)
                            }
                        </ul> :
                    <ul className='w-full px-1'>
                        {
                            chats?.map(room => <ChatLink room={room} userId={userId} key={room._id} />)
                        }
                    </ul>
            }

        </div>
    )
}

export default SideChat
