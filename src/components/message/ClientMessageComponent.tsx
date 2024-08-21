"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageForm } from "@/components/message/MessageForm";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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
  image_url: string;
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
  const router = useRouter();

  const searchParams = useSearchParams();

  const initialSelectedUser = searchParams.get("selectedUser");

  const [selectedUser, setSelectedUser] = useState<string | null>(initialSelectedUser);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const { user, setUser } = useAuthStore();

  const queryClient = useQueryClient();

  const messageEndRef = useRef<HTMLDivElement>(null);

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
    enabled: !!user && !isUserLoading,
    refetchInterval: 1000
  });

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

  const loadUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from("users").select("id, nickname, profile_img").eq("id", userId).single();

    if (error) {
      console.error("Error loading user profile:", error);
    } else {
      setSelectedUserProfile(data);
    }
  }, []);

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

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        Swal.fire({
          title: "로그인이 필요합니다!",
          text: "채팅을 이용하기 위해서는 로그인이 필요합니다!",
          icon: "warning"
        });
        router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/signin`);
      }
      setIsUserLoading(false);
    };
    checkUser();
  }, [router, setUser]);

  useEffect(() => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      markMessagesAsRead(selectedUser);
    }
  }, [selectedUser, markMessagesAsRead]);

  useEffect(() => {
    if (initialSelectedUser) {
      setSelectedUser(initialSelectedUser);
      loadUserProfile(initialSelectedUser);
    }
  }, [initialSelectedUser, loadUserProfile]);

  if (isUserLoading) return <div className="p-4 text-center">사용자 정보를 불러오는 중...</div>;
  if (!user) return <div className="p-4 text-center">로그인이 필요합니다.</div>;
  if (isLoading) return <div className="p-4 text-center">메시지를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-center">메시지를 불러오는 중 오류가 발생했습니다.</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <div className="flex h-full flex-col">
        {/* 상단 바 */}
        <div className="fixed z-10 flex h-16 w-full max-w-[420px] items-center justify-between border-b border-[#CDCDCD] bg-white px-4">
          <button onClick={handleGoBack} className="text-xl font-bold">
            <Image src="/assets/svg/Arrow - Left 2.svg" alt="Back" width={24} height={24} />
          </button>

          {selectedUserProfile && (
            <div className="flex flex-grow items-center justify-center">
              <div className="flex items-center">
                <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                  {selectedUserProfile.profile_img ? (
                    <Image
                      src={selectedUserProfile.profile_img}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-500">
                      <span className="text-xl font-bold text-white">
                        {selectedUserProfile.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-lg font-bold">{selectedUserProfile.nickname}</span>
              </div>
            </div>
          )}

          {/* 대화방 목록 버튼 */}
        </div>

        {/* 채팅 영역 */}
        <div className="flex flex-grow flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* 메시지 영역 */}
              <div
                className="flex-grow overflow-y-auto bg-white p-3 pt-20 scrollbar-hide"
                style={{
                  height: "calc(100vh - 25rem)",
                  paddingBottom: "2rem"
                }}
              >
                {groupedMessages[selectedUser]?.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}
                    style={{ flexShrink: 0 }}
                  >
                    <div className="flex max-w-[60%] items-end">
                      {message.sender_id === user.id && (
                        <span className="mr-2 text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          })}
                        </span>
                      )}
                      <div
                        className={`relative inline-block p-2 ${
                          message.sender_id === user.id
                            ? "rounded-bl-2xl rounded-br-none rounded-tl-2xl rounded-tr-2xl bg-mainColor text-white"
                            : "rounded-bl-2xl rounded-br-2xl rounded-tl-none rounded-tr-2xl bg-gray-200 text-black"
                        }`}
                        style={{
                          wordBreak: "break-word"
                        }}
                      >
                        {message.image_url && (
                          <div className="mb-2">
                            <Image
                              src={message.image_url}
                              alt="Message image"
                              width={200}
                              height={200}
                              className="rounded-lg"
                              style={{ width: "auto", height: "auto" }}
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                      {message.sender_id !== user.id && (
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>

              {/* 메시지 입력 폼 */}
              <MessageForm receiverId={selectedUser} markMessagesAsRead={markMessagesAsRead} />
            </>
          ) : (
            <div className="flex w-full flex-grow items-center justify-center p-4 text-gray-500">
              <span>대화 상대를 선택해 주세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
