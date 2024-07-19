"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PostsResponse } from "@/types/TypeOfCommunity/CommunityTypes";

interface PostListProps {
  selectedCategory: string;
}

const fetchPosts = async (page: number, category: string): Promise<PostsResponse> => {
  const response = await fetch(`/api/community?page=${page}&limit=18&category=${category}`);
  if (!response.ok) {
    throw new Error("메인페이지오류");
  }
  return response.json();
};

const PostList: React.FC<PostListProps> = ({ selectedCategory }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts", page, selectedCategory],
    queryFn: () => fetchPosts(page, selectedCategory)
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">게시글 목록</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((post) => (
          <Link key={post.id} href={`http://localhost:3000/community/${post.id}`}>
            <div className="flex rounded border p-4 shadow-sm">
              <div className="flex-grow pr-4">
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-2 text-gray-600">{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500">
                  작성자: {post.users.nickname} | 작성일: {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="h-20 w-20 flex-shrink-0 bg-gray-300">{/* 이미지 미리보기 공간 */}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* pagination섹션입니다  rgba(103,192,71,0.8) */}
      <div className="mt-8 flex justify-center space-x-2">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="rounded bg-[#67C047] px-4 py-2 text-white disabled:bg-[rgba(103,192,71,0.8)]"
        >
          이전
        </button>

        <span className="px-4 py-2">
          페이지 {page} / {data?.totalPages}
        </span>

        <button
          onClick={() => setPage((old) => (data?.totalPages && old < data.totalPages ? old + 1 : old))}
          disabled={data?.totalPages !== undefined && page === data.totalPages}
          className="rounded bg-[#67C047] px-4 py-2 text-white disabled:bg-[rgba(103,192,71,0.8)]"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PostList;
