"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageForm } from "@/components/message/MessageForm";
import { useAuthStore } from "@/zustand/useAuth";
import { supabase } from "@/supabase/userClient";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_nickname: string;
  receiver_nickname: string;
  nickname: string;
}

interface GroupedMessages {
  [userId: string]: Message[];
}

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    checkUser();
  }, [setUser]);

  const {
    data: messages,
    isLoading,
    error
  } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users!sender_id(nickname),
          receiver:users!receiver_id(nickname)
        `
        )
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data.map((message) => ({
        ...message,
        sender_nickname: message.sender.nickname,
        receiver_nickname: message.receiver.nickname
      }));
    },
    enabled: !!user
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupedMessages: GroupedMessages = messages
    ? messages.reduce((acc, message) => {
        const userId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        const nickname = message.sender_id === user?.id ? message.receiver_nickname : message.sender_nickname;

        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push({ ...message, nickname });
        return acc;
      }, {} as GroupedMessages)
    : {};

  if (!user) return <div className="p-4 text-center">로그인이 필요합니다.</div>;
  if (isLoading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">에러 발생: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto flex h-screen flex-col p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">쪽지함</h1>
      <div className="flex flex-grow overflow-hidden rounded-lg border border-[#1FE476]">
        <div className="w-1/3 overflow-y-auto border-r border-[#1FE476]">
          <ul>
            {Object.entries(groupedMessages).map(([userId, userMessages]) => (
              <li
                key={userId}
                className={`cursor-pointer p-4 hover:bg-gray-100 ${
                  selectedUser === userId ? "bg-[#1FE476] text-white" : ""
                }`}
                onClick={() => setSelectedUser(userId)}
              >
                {userMessages[0].nickname}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-2/3 flex-col">
          {selectedUser && (
            <>
              <div className="flex-grow overflow-y-auto p-4">
                {groupedMessages[selectedUser].map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${message.sender_id === user.id ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block rounded-lg p-2 ${
                        message.sender_id === user.id ? "bg-[#1FE476] text-white" : "bg-gray-200"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="mt-1 text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
              <MessageForm receiverId={selectedUser} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
