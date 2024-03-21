import ChatScreen from "@/components/ChatScreen";
import SideChat from "@/components/SideChat";
import Image from "next/image";

import { useState, useEffect } from 'react'
export default function Home() {
    // check the token if is valid
    return (
        <main className="grid grid-cols-3 h-screen py-10 px-6 max-w-7xl mx-auto">
            <SideChat />
            <ChatScreen />
        </main>
    );
}
