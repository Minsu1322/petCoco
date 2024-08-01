"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import { MatePostType } from "@/types/mate.type";
import { MatePostsResponse, PostsResponse } from "@/types/mainPageTypes/MainPageTypes";
import AnimalCarousel from "@/components/animalCarousel/AnimalCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";

export default function Home() {
  //메이트정보
  const fetchPostsMate = async () => {
    const response = await fetch("/api/mate");
    console.log(response);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: mateResponse,
    isLoading: isMateLoading,
    error: mateError
  } = useQuery<MatePostsResponse, Error>({
    queryKey: ["matePosts"],
    queryFn: fetchPostsMate
  });

  //자유게시판 정보
  const fetchPosts = async () => {
    const response = await fetch("/api/community");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  if (isLoading || isMateLoading) return <div>Loading...</div>;
  if (error || mateError) return <div>Error: {error?.message || mateError?.message}</div>;

  const OPTIONS: EmblaOptionsType = { align: "start", dragFree: true, loop: true };
  const SLIDE_COUNT = 7;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gray-100 p-10">
      {/* 배너 영역 */}
      <div className="flex h-60 w-8/12 items-center justify-center rounded-lg bg-sky-500 text-2xl font-bold text-white shadow-md">
        배너영역
      </div>
      {/* 게시글 영역 */}
      <div className="flex w-8/12 space-x-4">
        {/* 자유게시판 */}
        <div className="w-1/2 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community`}>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold hover:underline">최신 글 목록</h2>
          </Link>

          {data?.data.slice(0, 5).map((post) => (
            <div key={post.id} className="mb-3 w-full">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
                <div className="flex justify-between">
                  <div className="cursor-pointer text-black hover:underline">{post.title}</div>

                  <div className="text-sm font-bold">댓글 {post.comments.length}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 산책메이트 */}
        <div className="w-1/2 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate`}>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold hover:underline">산책메이트</h2>
          </Link>

          {mateResponse?.data.slice(0, 5).map((post) => (
            <div key={post.id} className="mb-2">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate/posts/${post.id}`}>
                <div className="flex justify-between">
                  <div className="cursor-pointer text-black hover:underline">{post.title}</div>
                  {post.recruiting ? (
                    <div className="w-16 rounded-lg bg-green-200 py-1 text-center text-sm text-green-600">모집중</div>
                  ) : (
                    <div className="w-16 rounded-lg bg-gray-200 py-1 text-center text-sm text-gray-600">모집완료</div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-8/12 flex-col items-center justify-center">
        <Image
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner003.png"
          alt="banner images"
          width={600}
          height={150}
          layout="responsive"
          className="rounded-lg"
        />

        <div className="mt-2 w-full rounded-lg border border-[#B4E85F] bg-white p-6 shadow-md">
          <h2 className="mb-8 text-xl font-semibold">주인님을 기다리고 있어요😥</h2>
          <AnimalCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      </div>
    </div>
  );
}
