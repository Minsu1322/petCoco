"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PostsResponse } from "@/types/TypeOfCommunity/CommunityTypes";

interface PostListProps {
  selectedCategory: string;
  searchTerm: string;
  selectedSort: string;
}

const fetchPosts = async (page: number, category: string, searchTerm: string): Promise<PostsResponse> => {
  const response = await fetch(`/api/community?page=${page}&limit=18&category=${category}&search=${searchTerm}`);
  if (!response.ok) {
    throw new Error("메인페이지오류");
  }
  return response.json();
};

const PostList: React.FC<PostListProps> = ({ selectedCategory, searchTerm, selectedSort }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts", page, selectedCategory, searchTerm],
    queryFn: () => fetchPosts(page, selectedCategory, searchTerm)
  });

  useEffect(() => {
    setPage(1); // 카테고리나 검색어가 변경되면 첫 페이지로 이동
  }, [selectedCategory, searchTerm]);

  const sortPosts = (posts: any[], sortBy: string) => {
    switch (sortBy) {
      case "최신순":
        return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "댓글많은순":
        return posts.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return posts;
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;

  const sortedPosts = sortPosts(data?.data || [], selectedSort);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">게시글 목록</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((post) => (
          <Link key={post.id} href={`http://localhost:3000/community/${post.id}`}>
            <div className="flex rounded border p-4 shadow-sm">
              <div className="flex-grow pr-4">
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-2 text-gray-600">{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500">
                  작성자: {post.users.nickname} | 작성일: {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">댓글 수: {post.comments.length}</p>
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
