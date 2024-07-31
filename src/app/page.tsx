"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import { MatePostType } from "@/types/mate.type";
import { MatePostsResponse, PostsResponse } from "@/types/mainPageTypes/MainPageTypes";

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

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-gray-100 p-10">
      {/* 배너 영역 */}
      <div className="flex h-40 w-8/12 items-center justify-center rounded-lg bg-sky-500 text-2xl font-bold text-white shadow-md">
        배너영역
      </div>

      {/* 장소 추천 영역 */}
      <div className="h-40 w-8/12 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">장소추천영역</h2>
        {/* 장소 추천 내용 */}
      </div>

      {/* 게시글 영역 */}
      <div className="flex w-8/12 space-x-4">
        {/* 자유게시판 */}
        <div className="w-1/2 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b pb-2 text-xl font-bold">최신 글 목록</h2>
          {data?.data.slice(0, 5).map((post) => (
            <div key={post.id} className="mb-2">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
                <div className="cursor-pointer text-black hover:underline">
                  {post.title} ({post.comments.length} 댓글)
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 산책메이트 */}
        <div className="w-1/2 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b pb-2 text-xl font-bold">산책메이트</h2>
          {mateResponse?.data.slice(0, 5).map((post) => (
            <div key={post.id} className="mb-2">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate/posts/${post.id}`}>
                <div className="cursor-pointer text-black hover:underline">{post.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
