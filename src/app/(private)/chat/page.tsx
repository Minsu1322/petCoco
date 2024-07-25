"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import ChatHeader from "@/components/chatting/ChatHeader";

const ChatMainPage = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log("Logged in user:", user);
  }, [user]);

  return (
    <div className="mx-auto h-screen max-w-3xl md:py-10">
      <div className="h-full rounded-md border">
        <ChatHeader user={user} />
        {/* 사용자 정보를 사용하여 채팅 기능 구현 */}
      </div>
    </div>
  );
};

export default ChatMainPage;
