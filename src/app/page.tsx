import ChatScreen from "@/components/ChatScreen";
import SideChat from "@/components/SideChat";

import { io } from 'socket.io-client';
import { useState, useEffect } from 'react'
import Image from "next/image";
export default function Home() {
  return (
    <main className="grid grid-cols-3 h-screen py-10 px-6 max-w-7xl mx-auto">
      <SideChat/>
      <ChatScreen/>
    </main>
  );
}
