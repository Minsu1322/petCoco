"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageForm } from "@/components/message/MessageForm";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getTimeDifference } from "@/app/utils/getTimeDifference";

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
  sender_profile?: {
    id: string;
    nickname: string;
    profile_img: string;
  };
  receiver_profile?: {
    id: string;
    nickname: string;
    profile_img: string;
  };
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
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      sender:users!sender_id(id, nickname, profile_img),
      receiver:users!receiver_id(id, nickname, profile_img)
    `
      )
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data.map((message: any) => ({
      ...message,
      sender_nickname: message.sender.nickname,
      receiver_nickname: message.receiver.nickname,
      sender_profile: message.sender,
      receiver_profile: message.receiver
    }));
  }, [user]);

  const {
    data: messages,
    isLoading,
    error
  } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: fetchMessages,
    enabled: !!user && !isUserLoading
    // refetchInterval: 1000
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages && selectedUser) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  const markMessagesAsRead = useCallback(
    async (userId: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("receiver_id", user.id)
        .eq("sender_id", userId)
        .eq("read", false);

      if (error) {
        console.error("Error marking messages as read:", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["messages", user.id] });
      }
    },
    [user, queryClient]
  );

  const setSelectedUserAndMarkRead = useCallback(
    (userId: string) => {
      setSelectedUser(userId);
      if (userId) {
        markMessagesAsRead(userId);
        const userProfile =
          messages?.find((m) => m.sender_id === userId)?.sender_profile ||
          messages?.find((m) => m.receiver_id === userId)?.receiver_profile;
        setSelectedUserProfile(userProfile);
      }
    },
    [markMessagesAsRead, messages]
  );

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

          // 자동으로 읽음 처리
          if (selectedUser && payload.new.sender_id === selectedUser && payload.new.receiver_id === user.id) {
            await markMessagesAsRead(selectedUser);
          }
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
  }, [user, queryClient, selectedUser, markMessagesAsRead]);

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

  useEffect(() => {
    if (selectedUser) {
      markMessagesAsRead(selectedUser);
    }
  }, [selectedUser, markMessagesAsRead]);

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

  const unreadCounts = messages
    ? messages.reduce(
        (acc, message) => {
          if (!message.read && message.receiver_id === user?.id) {
            const userId = message.sender_id;
            if (!acc[userId]) {
              acc[userId] = 0;
            }
            acc[userId]++;
          }
          return acc;
        },
        {} as { [userId: string]: number }
      )
    : {};

  if (isUserLoading) return <div className="p-4 text-center">사용자 정보를 불러오는 중...</div>;
  if (!user) return <div className="p-4 text-center">로그인이 필요합니다.</div>;
  if (isLoading) return <div className="p-4 text-center">메시지를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-center">메시지를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] max-w-4xl flex-col p-4">
      <div className="relative flex flex-grow overflow-hidden rounded-lg border border-mainColor">
        {/* 모바일 메뉴 토글 버튼 */}
        <button
          className="absolute right-4 top-4 z-30 block rounded-full bg-mainColor p-2 text-white shadow-md sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "닫기" : "메뉴"}
        </button>

        {/* 대화 목록 */}
        <div
          className={`w-full overflow-y-auto border-r border-mainColor transition-all duration-300 ease-in-out sm:w-1/3 ${isMobileMenuOpen ? "absolute inset-y-0 left-0 z-20 bg-white" : "hidden sm:block"}`}
        >
          <div className="h-16 border-b border-mainColor"></div>
          <ul>
            {Object.entries(groupedMessages).map(([userId, userMessages]) => (
              <li
                key={userId}
                className={`cursor-pointer p-4 hover:bg-gray-100 ${
                  selectedUser === userId ? "bg-mainColor text-white" : ""
                } flex items-center justify-between border-b border-mainColor`}
                onClick={() => {
                  setSelectedUserAndMarkRead(userId);
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center">
                  {userMessages[0].sender_profile?.profile_img ? (
                    <Image
                      src={userMessages[0].sender_profile.profile_img}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="mr-3 rounded-full"
                    />
                  ) : (
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-mainColor">
                      <span className="text-lg font-bold text-white">
                        {userMessages[0].sender_profile?.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold">{userMessages[0].nickname}</div>
                    <div className="truncate text-sm text-gray-600">
                      {userMessages[userMessages.length - 1].content}
                    </div>
                  </div>
                </div>
                <div className="mb-2 text-sm text-gray-500" style={{ whiteSpace: "nowrap" }}>
                  {getTimeDifference(userMessages[userMessages.length - 1].created_at)}
                </div>
                {unreadCounts[userId] > 0 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200 text-xs font-bold text-red-800">
                    {unreadCounts[userId]}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 메시지 영역 */}
        <div className="flex w-full flex-col sm:w-2/3">
          {selectedUser && selectedUserProfile && (
            <>
              <div className="flex h-16 items-center justify-center border-b border-mainColor bg-[#d0dbee] p-3">
                {selectedUserProfile.profile_img ? (
                  <Image
                    src={selectedUserProfile.profile_img}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="mr-3 rounded-full"
                  />
                ) : (
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-mainColor">
                    <span className="text-lg font-bold text-white">
                      {selectedUserProfile.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-lg font-bold">{selectedUserProfile.nickname}</span>
              </div>
              <div className="relative flex-grow overflow-y-auto scrollbar-hide">
                <div className="p-3">
                  {groupedMessages[selectedUser].map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${message.sender_id === user.id ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`relative inline-block p-2 ${
                          message.sender_id === user.id
                            ? "rounded-bl-2xl rounded-br-none rounded-tl-2xl rounded-tr-2xl bg-mainColor text-white"
                            : "rounded-bl-2xl rounded-br-2xl rounded-tl-none rounded-tr-2xl bg-gray-200 text-black"
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
              <MessageForm receiverId={selectedUser} markMessagesAsRead={markMessagesAsRead} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
