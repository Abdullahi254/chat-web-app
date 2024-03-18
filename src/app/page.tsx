"use client"

import { io } from 'socket.io-client';
import { useState, useEffect } from 'react'
import Image from "next/image";
export default function Home() {
    const client_socket = io('http://localhost:5000');
    const [isConnected, setIsConnected] = useState(client_socket.connected);
    const [sendMsg, setSendMsg] = useState(false);
    const sendServerMsg = () => {
        client_socket.emit('msg', { msg: 'Hello from Client' })
    }
    //TODO: Research on how to use hooks in react for sockets.
    //TODO: Ensure useEffect doesnt keep requesting on connections
    useEffect(() => {
        client_socket.on("connect", () => {
            setIsConnected(true);
        });
        client_socket.on("disconnect", () => {
            setIsConnected(false);
        });
        if (sendMsg) {
            client_socket.emit('msg', { msg: 'Hello from Client' })
        }
    }, []);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="text-xl font-semibold flex flex-col items-center justify-center">
                <div>
                    CHAT APP
                </div>
                <button className='bg-blue-500 rounded-md p-4' onClick={() => sendServerMsg()}>Send Msg To Server</button>
            </div>
            <div>
                {isConnected ? <div>Connected</div> : <div>Not Connected</div>}
            </div>
        </main>
    );
}
