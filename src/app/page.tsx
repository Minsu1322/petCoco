"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";

export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  comments: { id: string }[];
  users: {
    id: string;
    nickname: string;
  };
};

export type PostsResponse = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function Home() {
  //메이트정보
  const fetchPostsMate = async () => {
    const response = await fetch("/api/mate");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response)
    return response.json();
  };

  const { data: mateResponse } = useQuery<PostsResponse, Error>({
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 p-10">
      <div className="h-40 w-8/12 border border-sky-500">배너영역</div>

      <div className="h-40 w-8/12 border border-sky-500">장소추천영역</div>

      <div className="flex h-40 w-8/12 border border-sky-500">
        <div className="w-1/2 border border-green-500 p-4">
          <h2 className="mb-4 text-xl font-bold">최신 글 목록</h2>
          {data?.data.slice(0, 5).map((post) => (
            <div key={post.id} className="mb-2">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
                <div className="text-black hover:underline">
                  {post.title} ({post.comments.length} 댓글)
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="w-1/2 border border-green-500 p-4">
          <h2 className="mb-4 text-xl font-bold">산책메이트</h2>
          {/* 산책메이트 게시물 목록을 이곳에 추가 */}
        </div>
      </div>
    </div>
  );
}
