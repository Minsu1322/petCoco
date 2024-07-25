"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import ChatHeader from "@/components/chatting/ChatHeader";
import ChatInput from "@/components/chatting/ChatInput";

const ChatMainPage = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log("Logged in user:", user);
  }, [user]);

  return (
    <div className="mx-auto h-screen max-w-3xl md:py-10">
      <div className="flex h-full flex-col rounded-md border">
        <ChatHeader user={user} />
        <div className="flex h-full flex-1 flex-col overflow-y-auto p-5">
          <div className="flex-1"></div>
          <div className="space-y-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => {
              return (
                <div className="flex gap-2" key={value}>
                  <div className="h-10 w-10 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h1 className="font-bold">Minsu</h1>
                      <h1 className="text-sm text-gray-400">{new Date().toDateString()}</h1>
                    </div>
                    <p className="text-gray-500">goooood gooood test woow helloooo world</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatMainPage;
