"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageForm } from "@/components/message/MessageForm";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = createClient();

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
  profile_img: string;
}

interface GroupedMessages {
  [userId: string]: Message[];
}

export default function ClientMessageComponent() {
  const searchParams = useSearchParams();
  const initialSelectedUser = searchParams.get("selectedUser");
  const [selectedUser, setSelectedUser] = useState<string | null>(initialSelectedUser);
  const { user, setUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setIsUserLoading(false);
    };
    checkUser();
  }, [setUser]);

  const fetchMessages = useCallback(async () => {
    if (!user) return [];
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
    return data.map((message: any) => ({
      ...message,
      sender_nickname: message.sender.nickname,
      receiver_nickname: message.receiver.nickname
    }));
  }, [user]);

  const {
    data: messages,
    isLoading,
    error
  } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: fetchMessages,
    enabled: !!user && !isUserLoading,
    refetchInterval: 1000
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages && selectedUser) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  const subscribeToMessages = useCallback(() => {
    if (!user) return;

    console.log("Attempting to subscribe to messages channel");

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        async (payload) => {
          console.log("Received new message:", payload);
          await queryClient.invalidateQueries({ queryKey: ["messages", user.id] });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    setRealtimeChannel(channel);

    return () => {
      console.log("Unsubscribing from messages channel");
      channel.unsubscribe();
    };
  }, [user, queryClient]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToMessages]);

  useEffect(() => {
    const subscription = supabase.channel("system").subscribe((status) => {
      console.log(`Supabase realtime status: ${status}`);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  if (isUserLoading) return <div className="p-4 text-center">사용자 정보를 불러오는 중...</div>;
  if (!user) return <div className="p-4 text-center">로그인이 필요합니다.</div>;
  if (isLoading) return <div className="p-4 text-center">메시지를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">에러 발생: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto flex h-[calc(100vh-13rem)] max-w-4xl flex-col p-4">
      <div className="flex flex-grow overflow-hidden rounded-lg border border-mainColor">
        <div className="w-1/3 overflow-y-auto border-r border-mainColor">
          <div className="h-16 border-b border-mainColor"></div>
          <ul>
            {Object.entries(groupedMessages).map(([userId, userMessages]) => (
              <li
                key={userId}
                className={`cursor-pointer p-4 hover:bg-gray-100 ${
                  selectedUser === userId ? "bg-mainColor text-white" : ""
                } border-b border-mainColor`}
                onClick={() => setSelectedUser(userId)}
              >
                <div className="font-bold">{userMessages[0].nickname}</div>
                <div className="truncate text-sm text-gray-600">{userMessages[userMessages.length - 1].content}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-2/3 flex-col">
          {selectedUser && (
            <>
              <div className="flex h-16 flex-col justify-center border-b border-mainColor bg-[#d0dbee] p-3">
                <h1 className="text-lg font-bold">쪽지함</h1>
                <span className="text-sm text-gray-500">매너있는 대화 부탁드립니다</span>
              </div>
              <div className="relative flex-grow overflow-y-auto scrollbar-hide">
                <div className="sticky top-0 z-10 flex items-center border-b border-mainColor bg-white bg-opacity-70 p-3">
                  {groupedMessages[selectedUser][0].profile_img ? (
                    <Image
                      src={groupedMessages[selectedUser][0].profile_img}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                  ) : (
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-mainColor">
                      <span className="text-lg font-bold text-white">
                        {groupedMessages[selectedUser][0].nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-bold">{groupedMessages[selectedUser][0].nickname}</span>
                </div>
                <div className="p-3">
                  {groupedMessages[selectedUser].map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${message.sender_id === user.id ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block rounded-lg p-2 ${
                          message.sender_id === user.id ? "bg-mainColor text-white" : "bg-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-1 text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </div>
              <MessageForm receiverId={selectedUser} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
