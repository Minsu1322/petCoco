"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import { getTimeDifference } from "@/app/utils/getTimeDifference";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import LoadingComponent from "../loadingComponents/Loading";

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

export default function ClientMessageListComponent() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isUserLoading, setIsUserLoading] = useState(true);

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

  const sortedGroupedMessages = Object.entries(groupedMessages).sort((a, b) => {
    const lastMessageA = a[1][a[1].length - 1];
    const lastMessageB = b[1][b[1].length - 1];
    return new Date(lastMessageB.created_at).getTime() - new Date(lastMessageA.created_at).getTime();
  });

  const getOtherUserInfo = useCallback(
    (userMessages: any) => {
      const otherUser =
        userMessages[0].sender_id === user?.id ? userMessages[0].receiver_profile : userMessages[0].sender_profile;
      return {
        id: otherUser.id,
        nickname: otherUser.nickname,
        profile_img: otherUser.profile_img
      };
    },
    [user]
  );

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

  const handleSelectUser = (userId: string) => {
    router.push(`/message?selectedUser=${userId}`);
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

  if (isUserLoading)
    return (
      <div className="p-4 text-center">
        <LoadingComponent />
        사용자 정보를 불러오는 중...
      </div>
    );
  if (!user)
    return (
      <div className="p-4 text-center">
        <LoadingComponent />
        로그인이 필요합니다.
      </div>
    );
  if (isLoading)
    return (
      <div className="p-4 text-center">
        <LoadingComponent />
        메시지를 불러오는 중...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-center">
        <LoadingComponent />
        메시지를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <div className="flex-grow overflow-y-auto bg-white scrollbar-hide">
        <ul className="w-full">
          {sortedGroupedMessages.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center p-4 text-gray-500">
              <span>대화 상대가 없습니다.</span>
            </div>
          ) : (
            sortedGroupedMessages.map(([userId, userMessages]) => {
              const otherUser = getOtherUserInfo(userMessages);
              return (
                <li
                  key={userId}
                  className="flex w-full cursor-pointer items-center border-b p-4 hover:bg-gray-100"
                  onClick={() => handleSelectUser(userId)}
                >
                  <div className="mr-3 h-12 min-w-12 overflow-hidden rounded-2xl">
                    {otherUser.profile_img ? (
                      <Image
                        src={otherUser.profile_img}
                        alt="Profile"
                        width={48}
                        height={48}
                        className="h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-500">
                        <span className="text-xl font-bold text-white">
                          {otherUser.nickname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="text-sm font-bold">{otherUser.nickname}</div>
                    <div className="line-clamp-2 truncate whitespace-normal text-xs text-gray-600">
                      {userMessages[userMessages.length - 1].image_url
                        ? "[이미지파일]"
                        : userMessages[userMessages.length - 1].content}
                    </div>
                  </div>
                  <div className="flex w-auto flex-col gap-2">
                    <div className="min-w-[4rem] text-xs text-gray-500">
                      {getTimeDifference(userMessages[userMessages.length - 1].created_at)}
                    </div>
                    {unreadCounts[userId] > 0 && (
                      <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-400 p-1 text-xs font-bold text-white">
                        {unreadCounts[userId]}
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
