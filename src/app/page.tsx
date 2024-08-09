"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MatePostsAndUsersResponse, PostsResponse } from "@/types/mainPageTypes/MainPageTypes";
import AnimalCarousel from "@/components/animalCarousel/AnimalCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { fetchPostsMate, fetchPosts } from "./utils/mainPageFetch";
import { useState, useCallback } from "react";
import startChat from "./utils/startChat";
import Swal from "sweetalert2";
import MateCarousel from "@/components/mateCarousel/MateCarousel";

export default function Home() {
  const [currentMateIndex, setCurrentMateIndex] = useState(0);

  const { user } = useAuthStore();
  const router = useRouter();

  const {
    data: mateResponse,
    isLoading: isMateLoading,
    error: mateError
  } = useQuery<MatePostsAndUsersResponse, Error>({
    queryKey: ["matePosts"],
    queryFn: fetchPostsMate
  });

  const { data, isLoading, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  const handleStartChat = useCallback(() => {
    const currentMate = mateResponse?.data[currentMateIndex];
    if (currentMate && currentMate.users && currentMate.users[0]) {
      // 본인 글일 경우
      if (currentMate.users[0].id === user?.id) {
        Swal.fire({
          title: "자신에게 채팅을 시작할 수 없습니다.",
          text: "다른 사용자를 선택해 주세요.",
          icon: "warning",
          confirmButtonText: "확인"
        });
        return;
      }
      startChat(currentMate.users[0].id, user, router);
    }
  }, [mateResponse, currentMateIndex, user, router]);

  const nextMateSlide = useCallback(() => {
    setCurrentMateIndex((prevIndex) => (prevIndex + 1) % (mateResponse?.data.length || 1));
  }, [mateResponse]);

  const prevMateSlide = useCallback(() => {
    setCurrentMateIndex(
      (prevIndex) => (prevIndex - 1 + (mateResponse?.data.length || 1)) % (mateResponse?.data.length || 1)
    );
  }, [mateResponse]);

  if (isLoading || isMateLoading) return <div>Loading...</div>;
  if (error || mateError) return <div>Error: {error?.message || mateError?.message}</div>;

  const AnimalOPTIONS: EmblaOptionsType = { align: "center", dragFree: true, loop: true, startIndex: 2 };
  const AnimalSLIDE_COUNT = 7;
  const AnimalSLIDES = Array.from(Array(AnimalSLIDE_COUNT).keys());

  const MateOPTIONS: EmblaOptionsType = { dragFree: true, loop: true };
  const MateSLIDE_COUNT = 5;
  const MateSLIDES = Array.from(Array(MateSLIDE_COUNT).keys());

  const currentMate = mateResponse?.data[currentMateIndex];

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 sm:p-6 md:p-10">
      <div className="flex w-full flex-col items-center justify-center sm:w-full">
        {/* 배너 영역 */}
        <Image
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner004.png"
          alt="banner images"
          width={600}
          height={150}
          layout="responsive"
          className="rounded-lg"
        />
      </div>

      {/* 게시글 영역 */}
      <div className="flex w-full flex-col px-4 space-y-4 sm:space-y-6 md:w-8/12 md:flex-row md:space-x-4 md:space-y-0">
        {/* 자유게시판 */}
        <div className="w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md sm:w-full md:w-1/2 md:p-6">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community`}>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold hover:underline">방금 올라온 반려이야기😀</h2>
          </Link>

          {data?.data.slice(0, 5).map((post, index) => (
            <div key={post.id} className={`mb-3 w-full ${index !== 0 ? "border-t border-gray-200 pt-3" : ""}`}>
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={post.users.profile_img} alt="User Profile" className="h-8 w-8 rounded-md" />
                    <div>
                      <div className="cursor-pointer text-black hover:underline">{post.title}</div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{post.users.nickname}</span>
                        <span>-</span>
                        <span>댓글 {post.comments.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.post_imageURL[0] && (
                      <img src={post.post_imageURL[0]} alt="Post Image" className="h-12 w-12 rounded-md object-cover" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 산책메이트 */}
        <div className="w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md sm:w-full md:w-1/2 md:p-6">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate`}>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold hover:underline">함께 산책할 친구를 찾아요!</h2>
          </Link>
          {currentMate && (
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-start">
                <img
                  src={
                    currentMate.users[0]?.profile_img ||
                    "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/profile_img/default-profile.jpg"
                  }
                  alt="User Profile"
                  className="mr-4 h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{currentMate.title}</h3>
                  <p className="text-sm text-gray-600">{currentMate.place_name}</p>
                  <p className="text-sm text-gray-600">
                    {currentMate.recruitment_start && new Date(currentMate.recruitment_start).toLocaleDateString()} ~
                    {currentMate.recruitment_end && new Date(currentMate.recruitment_end).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center">
                    <p className="mr-2 text-sm">모집인원: {currentMate.members}</p>
                    {currentMate.recruiting ? (
                      <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-700">모집중</span>
                    ) : (
                      <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">모집완료</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleStartChat}
                className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
              >
                대화 시작하기
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-between">
            <button onClick={prevMateSlide} className="rounded-lg bg-gray-200 px-4 py-2">
              ←
            </button>
            <button onClick={nextMateSlide} className="rounded-lg bg-gray-200 px-4 py-2">
              →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-1 bg-white w-full rounded-lg border-2 border-[#a4d555] p-4">
        <MateCarousel slides={MateSLIDES} options={MateOPTIONS} />
      </div>

      <div className="flex w-full flex-col items-center justify-center sm:w-auto md:w-8/12">
        <Image
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner003.png"
          alt="banner images"
          width={600}
          height={150}
          layout="responsive"
          className="rounded-lg"
        />

        <div className="mt-1 w-full rounded-lg border-2 border-[#a4d555] p-4">
          <AnimalCarousel slides={AnimalSLIDES} options={AnimalOPTIONS} />
        </div>
      </div>
    </div>
  );
}
